class Ajax {
    /**
     * GET запрос
     * @param {string} url
     * @param {function} callback
     */
    get(url, callback) {
        fetch(url)
            .then(response => response.json().then(data => callback(data, response.status)))
            .catch(error => {
                console.error('GET error:', error);
                callback(null, 500);
            });
    }

    /**
     * POST запрос
     * @param {string} url
     * @param {object} data
     * @param {function} callback
     */
    post(url, data, callback) {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(async response => {
            const text = await response.text();
            let parsedData = null;
            try {
                parsedData = text ? JSON.parse(text) : null;
            } catch {
                console.warn("Не удалось распарсить JSON из ответа");
            }
            callback(parsedData, response.status);
        })
        .catch(error => {
            console.error('POST error:', error);
            callback(null, 500);
        });
    }

    /**
     * PATCH запрос
     * @param {string} url
     * @param {object} data
     * @param {function} callback
     */
    patch(url, data, callback) {
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json().then(data => callback(data, response.status)))
            .catch(error => {
                console.error('PATCH error:', error);
                callback(null, 500);
            });
    }

    /**
     * DELETE запрос
     * @param {string} url
     * @param {function} callback
     */
    delete(url, callback) {
        fetch(url, { method: 'DELETE' })
            .then(response => response.json().then(data => callback(data, response.status)))
            .catch(error => {
                console.error('DELETE error:', error);
                callback(null, 500);
            });
    }
}

export const ajax = new Ajax();