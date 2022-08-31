//该模块用于获取 识别临时游客的唯一一个uuid
//由于uuid每次生成的id都是唯一值，需要使用到本地存储，保证一个游客只有一个uuid
import {v4 as uuidv4} from 'uuid'

export const getUuidToken = () =>  {
  let uuid_token = localStorage.getItem('UUID_TOKEN')
  //先获取本地存储的UUID_TOKEN的值，如果有，则不需要生成uuid，直接返回上一次生成的uuid即可
  if(!uuid_token) {
    //如果本地存储中没有找到对应的key，就需要给游客生成一个uuid
    let uuid_token = uuidv4()
    localStorage.setItem('UUID_TOKEN', uuid_token)
  }
  return uuid_token
}