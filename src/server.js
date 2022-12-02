
let call_back = null

export const RequireLogin = ( cb )=>{
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
                if( response.status === 401 ){
                    call_back( false )
                    throw new Error( "login fails" )
                }

                if( !response.ok ){
                    throw new Error( "[" + url + "] 请求失败 status:" + response.status )
                }
                return response.json(); 
            }).then((data) => {
                if (success) {
                    success(data)
                }
            }).catch( err =>{
                console.log( err )
            } )
    }

    Login( userName, password ) {
        fetch('/daka/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "name=" +userName +"&password=" + password ,
        }).then((response) => {
            if( !response.ok ){
                throw new Error('Network response was not OK');
            }
            return response.json()
        }).then( data=>{
            call_back( data.Ret === 0 )
        } ).catch( (err) =>{
            console.log( err )
        })
    }

    DeleteKnowledgePost(post_id, success, fail) {
        this.post('/daka/api/knowledge/post/delete', { post_id: post_id }, success, fail)
    }

    GetKnowledgePost( post_id, success, fail ){
        this.post('/daka/api/knowledge/post/get', { post_id: post_id }, success, fail)
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
