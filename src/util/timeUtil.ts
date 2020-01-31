function timeout(ms: number): Promise<any> {
    return new Promise((resolve, reject) =>
        setTimeout(() => reject("timed out in " + ms + "ms."), ms));
}

export {
    timeout,
};
