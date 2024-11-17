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
			// this.server_host = window.location.origin;
			this.server_host = "http:/localhost:5124"
		}else{
			this.server_host = "http://localhost:5124"
		}
		this.http = axios.create({
			baseURL: this.server_host,
			timeout: 1000*60, 
		})

		// 响应拦截
		// this.http.interceptors.response.use(response => {
		// 	return response.data;
		// })

		this.http.interceptors.response.use(response => {
            return response.data
        })

	}

	_post(url, data){
		return this.http.post(url, qs.stringify(data));
	}

	开始翻译_中文项目 = (data) => {
        const url = "/开始翻译_中文项目"
        return this._post(url, data);
    }

	开始翻译_中文原项目 = (data) => {
		const url = "/开始翻译_中文原项目"
		return this._post(url, data);
	}

	开始翻译_中文py文件 = (data) => {
		const url = "/开始翻译_中文py文件"
		return this._post(url, data);
	}

	开始翻译_英文项目 = (data) => {
		const url = "/开始翻译_英文项目"
		return this._post(url, data);
	}

	开始翻译_英文文件 = (data) => {
		const url = "/开始翻译_英文文件"
		return this._post(url, data);
	}

	停止翻译_英文项目 = () => {
		const url = "/停止翻译_英文项目"
		return this.http.get(url)
	}

	停止翻译_中文项目 = () => {
		const url = "/停止翻译_中文项目"
		return this.http.get(url)
	}

	获取进度 = () => {
		const url = "/获取进度"
		return this.http.get(url)
	}

	获取状态信息 = () => {
		const url = "/获取状态信息"
		return this.http.get(url)
	}



}

export default new Http()