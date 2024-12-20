import axios from "axios";
import { Post } from "../types/Post";

const URL_BASE_REST_API = 'https://6761bcb346efb3732372cd53.mockapi.io/api/v1/posts';

export const fetchPosts = async (): Promise<Post[]> => {
    try {
        const response = await axios.get<Post[]>(URL_BASE_REST_API);
        return response.data;
    } catch (error) {
        console.error('fetchPosts error:', error);
        throw new Error(error instanceof Error ? error.message : "Error desconocido");;
    }
}

export const createPost  = async (post: Partial<Post>): Promise<Post> => {
    try {
        console.log(post);
        const response = await axios.post<Post>(URL_BASE_REST_API, post);
        return response.data;
    } catch (error) {
        console.error('createPost error:', error);
        throw new Error(error instanceof Error ? error.message : "Error desconocido");;
    }
}

const waitFor = (time: number): Promise<void> => {
    if (typeof time !== "number" || time < 0) throw new Error(`waitFor debe recibir un número positivo (en milisegundos). Se ha recibido ${JSON.stringify(time)} (${typeof time})`)
    return new Promise(resolve => setTimeout(resolve, time))
  }

export const deletePost = async (id: number): Promise<number> => {
    try {
        await axios.delete(`${URL_BASE_REST_API}/${id}`);
        return id;
    } catch (error) {
        console.error('deletePost error:', error);
        throw new Error(error instanceof Error ? error.message : "Error desconocido");;
    }
}