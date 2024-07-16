"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePreview = exports.mainGenerate = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Text2ImageAPI {
    constructor(url, apiKey, secretKey) {
        this.URL = url;
        this.AUTH_HEADERS = {
            "X-KEY": `Key ${apiKey}`,
            "X-Secret": `Secret ${secretKey}`,
        };
    }
    getModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.URL}key/api/v1/models`, {
                headers: this.AUTH_HEADERS,
            });
            return response.data[0].id;
        });
    }
    generate(prompt_1, model_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, model, images = 1, width = 1024, height = 1024) {
            const params = {
                type: "GENERATE",
                numImages: images,
                width,
                height,
                generateParams: {
                    query: prompt,
                },
            };
            const formData = new form_data_1.default();
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
            const response = yield axios_1.default.post(`${this.URL}key/api/v1/text2image/run`, formData, {
                headers: Object.assign(Object.assign(Object.assign({}, formData.getHeaders()), this.AUTH_HEADERS), { "Content-Type": "multipart/form-data" }),
            });
            const data = response.data;
            return data.uuid;
        });
    }
    checkGeneration(requestId_1) {
        return __awaiter(this, arguments, void 0, function* (requestId, attempts = 10, delay = 10) {
            while (attempts > 0) {
                try {
                    const response = yield axios_1.default.get(`${this.URL}key/api/v1/text2image/status/${requestId}`, { headers: this.AUTH_HEADERS });
                    const data = response.data;
                    if (data.status === "DONE") {
                        return data.images;
                    }
                }
                catch (error) {
                    console.error(error);
                }
                attempts--;
                yield new Promise((resolve) => setTimeout(resolve, delay * 1000));
            }
        });
    }
}
const mainGenerate = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const api = new Text2ImageAPI("https://api-key.fusionbrain.ai/", "BED0EF10AAE9CCBAE91491C7CF0AE2E8", "B5879783D8A887189954E38000F258D0");
    const modelId = yield api.getModels();
    const uuid = yield api.generate(prompt, modelId, 1, 1024, 1024);
    const images = yield api.checkGeneration(uuid);
    const base64String = images[0];
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    // Запись буфера в файл
    const fileName = Date.now().toString() + "image.jpg";
    fs_1.default.writeFile(path_1.default.join(__dirname, "..", "uploads", fileName), buffer, "base64", (err) => {
        if (err)
            throw err;
    });
    console.log(fileName);
    return fileName;
});
exports.mainGenerate = mainGenerate;
const generatePreview = (req, res) => {
    const { prompt } = req.body;
    const fileName = (0, exports.mainGenerate)(prompt).then((fileName) => {
        console.log(fileName);
        res.status(200).json({ preview: fileName });
    });
    console.log(fileName);
};
exports.generatePreview = generatePreview;
