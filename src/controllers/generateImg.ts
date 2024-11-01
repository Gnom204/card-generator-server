import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { fileURLToPath } from "url";
import { Request, Response } from "express";
import path from "path";
import { dirname } from "path";
import AuthHeaders from "../types/auth_headers-type";

class Text2ImageAPI {
  URL: string;
  AUTH_HEADERS: any;
  constructor(url: string, apiKey: string, secretKey: string) {
    this.URL = url;
    this.AUTH_HEADERS = {
      "X-KEY": `Key ${apiKey}`,
      "X-Secret": `Secret ${secretKey}`,
    };
  }
  async getModels() {
    const response = await axios.get(`${this.URL}key/api/v1/models`, {
      headers: this.AUTH_HEADERS as any,
    });
    return response.data[0].id;
  }
  async generate(
    prompt: string,
    model: any,
    images = 1,
    width = 1024,
    height = 1024
  ) {
    const params = {
      type: "GENERATE",
      numImages: images,
      width,
      height,
      generateParams: {
        query: prompt,
      },
    };
    const formData = new FormData();
    const modelIdData = {
      value: model,
      options: { contentType: "application/json" },
    };
    const paramsData = {
      value: JSON.stringify(params),
      options: { contentType: "application/json" },
    };
    formData.append("model_id", modelIdData.value, modelIdData.options);
    formData.append("params", paramsData.value, paramsData.options);

    const response = await axios.post(
      `${this.URL}key/api/v1/text2image/run`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          ...this.AUTH_HEADERS,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    return data.uuid;
  }
  async checkGeneration(requestId: any, attempts = 10, delay = 10) {
    while (attempts > 0) {
      try {
        const response = await axios.get(
          `${this.URL}key/api/v1/text2image/status/${requestId}`,
          { headers: this.AUTH_HEADERS }
        );
        const data = response.data;
        if (data.status === "DONE") {
          return data.images;
        }
      } catch (error) {
        console.error(error);
      }
      attempts--;
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }
  }
}

export const mainGenerate = async (prompt: string) => {
  const api = new Text2ImageAPI(
    "https://api-key.fusionbrain.ai/",
    "D63C436F686AE616B923D54F3988C51E",
    "FAC9F82D66906FDC91EABC1F4CC20E17"
  );
  const modelId = await api.getModels();
  const uuid = await api.generate(prompt, modelId, 1, 1024, 1024);
  const images = await api.checkGeneration(uuid);
  const base64String = images[0];
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Запись буфера в файл
  const fileName = Date.now().toString() + "image.jpg";
  fs.writeFile(
    path.join(__dirname, "..", "uploads", fileName),
    buffer,
    "base64",
    (err) => {
      if (err) throw err;
    }
  );
  console.log(fileName);
  return fileName;
};

export const generatePreview = (req: Request, res: Response) => {
  const { prompt } = req.body;
  const fileName = mainGenerate(prompt).then((fileName) => {
    console.log(fileName);
    res.status(200).json({ preview: fileName });
  });
  console.log(fileName);
};
