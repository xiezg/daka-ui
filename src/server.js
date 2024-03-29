
let call_back = null

export const RequireLogin = (cb) => {
    call_back = cb
}

class Server {

    post(url, req_obj, success, fails) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req_obj)
        };

        fetch(url, requestOptions)
            .then(response => {
                if (response.status === 401) {
                    call_back(false)
                    throw new Error("login fails")
                }

                if (!response.ok) {
                    throw new Error("[" + url + "] 请求失败 status:" + response.status)
                }
                return response.json();
            }).then((data) => {
                if (success) {
                    success(data)
                }
            }).catch(err => {
                console.log(err)
            })
    }

    Login(userName, password) {
        fetch('/daka/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "name=" + userName + "&password=" + password,
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json()
        }).then(data => {
            call_back(data.Ret === 0)
        }).catch((err) => {
            console.log(err)
        })
    }

    DeleteKnowledgePost(post_id, success, fail) {
        this.post('/daka/api/knowledge/post/delete', { post_id: post_id }, success, fail)
    }

    GetKnowledgePost(post_id, success, fail) {
        this.post('/daka/api/knowledge/post/get', { post_id: post_id }, success, fail)
    }

    StatKnowledgePost(success){
        this.post('/daka/api/knowledge/stat', null, success)
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

    TaskSet(task_id, task_msg) {
        this.post('/daka/api/daily/task/set', { task_id: task_id, task_msg: task_msg })
    }

    TaskDetailSet(task_id, task_detail) {
        this.post('/daka/api/daily/task/detail/set', { task_id: task_id, task_msg: task_detail })
    }

    TaskList( start_id,success ) {
        this.post('/daka/api/daily/task/list', { start_id:start_id } ,success )
    }

    TaskStat( perfix_len, top_num, success ) {
        this.post('/daka/api/daily/task/stat', { perfix_len:perfix_len,top_num:top_num  } ,success )
    }
}

export default new Server();
