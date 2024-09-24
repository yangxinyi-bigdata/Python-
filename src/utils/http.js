import axios from "axios"
import qs from "qs";

// http://www.zlkt.net
// const SERVER_HOST = "http://127.0.0.1:5000"
// window.location.origin

// const SERVER_HOST = window.location.origin;

// const SERVER_HOST = process.env.VUE_APP_SERVER_HOST


// 配置文件
// .env
// .env.[mode]

// mode：development、test、production

// npm run server：用的是development模式
// npm run build：默认用的是production模式
// npm run build -- --mode [模式，比如：development]来指定具体的模式

// 不同的模式，会读取对应模式下的配置参数
// development模式：.env.development配置文件
// production模式：.env.development配置文件

// 在配置文件中，只能有三种类型的配置项：NODE_ENV，BASE_URL，VUE_APP_开头的
// 比如：VUE_APP_SERVER_HOST

// 配置项中，只能是字符串，不能填一些js代码。比如window.location.origin
// 这样去写，实际上是一个"window.location.origin"

class Http {
	constructor() {
		if(process.env.NODE_ENV == 'production'){
			this.server_host = window.location.origin;
		}else{
			this.server_host = "http://127.0.0.1:5001"
		}
		this.http = axios.create({
			baseURL: this.server_host,
			timeout: 1000*60
		});


		// 响应拦截
		// this.http.interceptors.response.use(response => {
		// 	return response.data;
		// })

		this.http.interceptors.response.use(resonse => {
			return resonse.data
		})


	}

	_post(url, data){
		return this.http.post(url, qs.stringify(data));
	}

	开始翻译(data){
		const url = "/开始翻译"
		return this._post(url, data);
	}

	getBannerList(data){
		const url = "/banner/list"
		return this.http.get(url, data);
	}

	deleteBanner(banner_id){
		const url = "/banner/delete"
		return this._post(url, {"id": banner_id})
	}

	editBanner(data){
		const url = "/banner/edit"
		return this._post(url, data);
	}

	getPostList(page){
		const url = "/post/list?page=" + (page?page:1)
		console.log(url);
		return this.http.get(url);
	}

	deletePost(post_id){
		const url = "/post/delete"
		return this._post(url, {"id": post_id})
	}

	deleteComment(comment_id){
		const url = "/comment/delete"
		return this._post(url, {"comment_id": comment_id})
	}

	getCommentList(page){
		const url = "/comment/list?page=" + (page?page:1)
		return this.http.get(url);
	}

	getUserList(page){
		const url = "/user/list?page=" + (page?page:1)
		return this.http.get(url);
	}

	activeUser(user_id, is_active){
		const url = "/user/active"
		return this._post(url, {"user_id": user_id, "is_active": is_active})
	}

	getBoardPostCount(){
		const url = "/board/post/count"
		return this.http.get(url);
	}

	getDay7PostCount(){
		const url = "/day7/post/count"
		return this.http.get(url)
	}

	

}

export default new Http()