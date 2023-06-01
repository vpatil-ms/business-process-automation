import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BpaServiceObject } from "../engine/types";

export class OpenAI {


    private _endpoint: string
    private _apikey: string
    private _deploymentId: string

    constructor(endpoint: string, apikey: string, deploymentId: string) {
        this._apikey = apikey
        this._endpoint = endpoint
        this._deploymentId = deploymentId


    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {


        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/completions?api-version=2022-12-01`

        const openAiInput = {
            "prompt": input.data.slice(0, 4000) + "\n\n Tl;dr:",
            "max_tokens": 256
        }

        const out = await axios.post(url, openAiInput, config)
        const results = input.aggregatedResults
        results["openaiSummarize"] = out.data
        input.resultsIndexes.push({ index: index, name: "openaiSummarize", type: "openaiSummarize" })
        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiSummarize',
            label: 'openaiSummarize',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id
        }

        return result
    }

    public processGeneric = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {


        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/completions?api-version=2022-12-01`

        const truncatedString = input.data.slice(0, 3500)

        const prompt = input.serviceSpecificConfig.replace(/(\r\n|\n|\r|\t)/gm, " ")
        let openAiInput = JSON.parse(prompt)
        openAiInput.prompt = openAiInput.prompt.replace("${document}", truncatedString)

        let out = await axios.post(url, openAiInput, config)
        out.data.sourcePrompt = openAiInput.prompt
        const results = input.aggregatedResults
        if(results?.openaiGeneric){
            results["openaiGeneric"].push(out.data)
        } else{
            results["openaiGeneric"] = [out.data]
        }
        input.resultsIndexes.push({ index: index, name: "openaiGeneric", type: "openaiGeneric" })
        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiGeneric',
            label: 'openaiGeneric',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id
        }
        return result

    }

    public generic = async (prompt : string, maxTokens : number): Promise<any> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/completions?api-version=2022-12-01`

        const openAiInput = {
            "prompt": prompt,
            "max_tokens": maxTokens
        }

        const out = await axios.post(url, openAiInput, config)
        return out.data
    }

    public getEmbeddings = async (text : string) : Promise<AxiosResponse<any, any>> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/embeddings?api-version=2022-12-01`

        const truncatedString = text.slice(0, 3500)

        const openAiInput = {
            "input": truncatedString
        }

        const out = await axios.post(url, openAiInput, config)
        return out.data
    }

    public processEmbeddings = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {


        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/embeddings?api-version=2022-12-01`

        const truncatedString = input.data.slice(0, 2000)

        const openAiInput = {
            "input": truncatedString
        }

        const out = await axios.post(url, openAiInput, config)
        const results = input.aggregatedResults
        results["openaiEmbeddings"] = out.data
        input.resultsIndexes.push({ index: index, name: "openaiEmbeddings", type: "openaiEmbeddings" })
        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiEmbeddings',
            label: 'openaiEmbeddings',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id
        }
        return result

    }
}