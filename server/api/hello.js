// 对 axios get 请求的封装

import axios from "axios";
import getSecuritySign from "../sign";
const ERR_OK = 0;
const token = 5381;

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: "utf8",
  outCharset: "utf-8",
  notice: 0,
  needNewCode: 0,
  format: "json",
  platform: "yqq.json",
};
// 修改请求的 headers 值，合并公共请求参数
function get(url, params) {
  return axios.get(url, {
    headers: {
      referer: "https://y.qq.com/",
      origin: "https://y.qq.com/",
    },
    params: Object.assign({}, commonParams, params),
  });
}

// 对 axios post 请求的封装≤
// 修改请求的 headers 值
function post(url, params) {
  return axios.post(url, params, {
    headers: {
      referer: "https://y.qq.com/",
      origin: "https://y.qq.com/",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 获取一个随机数值
function getRandomVal(prefix = "") {
  return prefix + (Math.random() + "").replace("0.", "");
}

// 获取一个随机 uid
function getUid() {
  const t = new Date().getUTCMilliseconds();
  return "" + ((Math.round(2147483647 * Math.random()) * t) % 1e10);
}

export default defineEventHandler((event) => {
  const url = "https://u.y.qq.com/cgi-bin/musics.fcg";
  // 随机数值
  const randomVal = getRandomVal("recom");
  // 计算签名值
  // 构造请求 data 参数
  const data = JSON.stringify({
    comm: { ct: 24 },
    recomPlaylist: {
      method: "get_hot_recommend",
      param: { async: 1, cmd: 2 },
      module: "playlist.HotRecommendServer",
    },
    focus: {
      module: "music.musicHall.MusicHallPlatform",
      method: "GetFocus",
      param: {},
    },
  });
  const sign = getSecuritySign(data);

  return get(url, {
    sign,
    "-": randomVal,
    data,
  }).then((response) => {
    const data = response.data;
    if (data.code === ERR_OK) {
      // 处理轮播图数据
      const focusList = data.focus.data.shelf.v_niche[0].v_card;
      const sliders = [];
      const jumpPrefixMap = {
        10002: "https://y.qq.com/n/yqq/album/",
        10014: "https://y.qq.com/n/yqq/playlist/",
        10012: "https://y.qq.com/n/yqq/mv/v/",
      };
      // 最多获取 10 条数据
      const len = Math.min(focusList.length, 10);
      for (let i = 0; i < len; i++) {
        const item = focusList[i];
        const sliderItem = {};
        // 单个轮播图数据包括 id、pic、link 等字段
        sliderItem.id = item.id;
        sliderItem.pic = item.cover;
        if (jumpPrefixMap[item.jumptype]) {
          sliderItem.link =
            jumpPrefixMap[item.jumptype] + (item.subid || item.id) + ".html";
        } else if (item.jumptype === 3001) {
          sliderItem.link = item.id;
        }

        sliders.push(sliderItem);
      }

      // 处理推荐歌单数据
      const albumList = data.recomPlaylist.data.v_hot;
      const albums = [];
      for (let i = 0; i < albumList.length; i++) {
        const item = albumList[i];
        const albumItem = {};
        // 推荐歌单数据包括 id、username、title、pic 等字段
        albumItem.id = item.content_id;
        albumItem.username = item.username;
        albumItem.title = item.title;
        albumItem.pic = item.cover;

        albums.push(albumItem);
      }

      // 往前端发送一个标准格式的响应数据，包括成功错误码和数据
      return {
        code: ERR_OK,
        result: {
          sliders,
          albums,
        },
      };
    } else {
      return data;
    }
  });
});
