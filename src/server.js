
class Server {

    post(url, req_obj, success, fails) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req_obj)
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then((data) => {
                if (success) {
                    success(data)
                }
            });
    }

    Login() {
        fetch('/daka/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'name=123&password=123',
        }).then((response) => {
            // return response.json()
        }).then((data) => {
            // console.log(data)
        }).catch(function (error) {
            console.log(error)
        })
    }

    DeleteKnowledgePost(post_id, success, fail) {
        this.post('/daka/api/knowledge/post/delete', { post_id: post_id }, success, fail)
    }

    ListKnowledgePost(success) {
        this.post('/daka/api/knowledge/list', null, success)
    }

    NewKnowledgePost(title, category, success) {
        this.post('/daka/api/knowledge/post/new', { title: title, category: category }, success)
    }

    UpdateKnowledgePost(post_id, innerHtml, title, success) {
        this.post('/daka/api/knowledge/post/update', { post_id: post_id, title: title, category: null, innerHtml: innerHtml }, success)
    }
}

export default new Server();
