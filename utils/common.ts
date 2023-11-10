export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    return String(error)
}

const COMMON = {
    getErrorMessage
}

export default COMMON;
