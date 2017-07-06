import axios from 'axios'
import CONFIG from './config'

class ApiManager {
  /**
   * Network Request：function GET
   *
   * @param {Object} data (url, body, header)
   * @param {Function} success request success
   * @param {Function} failure request failure
   */
  get (data, success, failure) {
    let method = 'get'
    this._sendRequest(data, method, success, failure)
  }
  /**
   * Network Request：function POST
   *
   * @param {Object} data (url, body, header)
   * @param {Function} success request success
   * @param {Function} failure request failure
   */
  post (data, success, failure) {
    let method = 'post'
    this._sendRequest(data, method, success, failure)
  }
  /**
   * Network Request：function DELETE
   *
   * @param {Object} data (url, body, header)
   * @param {Function} success request success
   * @param {Function} failure request failure
   */
  delete (data, success, failure) {
    let method = 'delete'
    this._sendRequest(data, method, success, failure)
  }
  /**
   * Network Request：function PUT
   *
   * @param {Object} data (url, body, header)
   * @param {Function} success request success
   * @param {Function} failure request failure
   */
  put (data, success, failure) {
    let method = 'put'
    this._sendRequest(data, method, success, failure)
  }
    /**
   * Network Request: Request MAIN
   *
   * @param {Object} data request data
   * @param {String} method request method
   * @param {Function} success request success
   * @param {Function} fail request failure
   */
  _sendRequest (data, method, success, failure) {
    let config = Object.assign({}, CONFIG)
    config.method = method
    config.headers = data.header ? data.header : config.headers
    config.url = data.url
    if (method === 'get') {
      config.params = data.body
    } else {
      config.data = data.body
    }
    axios.defaults.withCredentials = true
    return axios(config).then(res => {
      if (!res || !res.data) {
        failure
        return
      }
      success(res)
    }).catch(err => {
      failure(err)
    })
  }
}
let apiManager = new ApiManager()
export default apiManager
