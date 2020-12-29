interface APIResponseWithValue<T> {
    error: boolean;
    message: string;
    value: T;
}

export default APIResponseWithValue
