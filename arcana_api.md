# A网接口
下面内容为手动测试的A网IIDX查询成绩相关接口，逐步更新
baseURL： https://arcana.nu

鉴权：

Request Header: authorization （Bearer Token）

#### 登录

- **api**  /account/login

- **method** POST

- **params**  form-data

  | KEY         | VALUE                      | DESCRIPTION    |
  | ----------- | -------------------------- | -------------- |
  | redirect_to | https://arcana.nu/account/ | 登录后跳转页面 |
  | username    | 123456789@qq.com           | 用户名/邮箱    |
  | password    | ABC1234                    | 密码           |

- **Response Headers**

  | name           | format                                                       | notes                            |
  | -------------- | ------------------------------------------------------------ | -------------------------------- |
  | content-length | 0                                                            |                                  |
  | date           | Sun, 14 Mar 2021 08:44:25 GMT                                |                                  |
  | expires        | Thu, 01 Jan 1970 00:00:00 GMT                                |                                  |
  | location       | https://arcana.nu/account/                                   |                                  |
  | set-cookie     | auth=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjb29raWUiLCJpYXQiOjE2MTU3MTE0NjUsInN1YiI6IjY0MjA0NjI2MUBxcS5jb20ifQ.HSYRkge8WKBkLRxyYFqSVnLkrsWysWXKwtZ127nKMs0;Path=/;Expires=Mon, 14-Mar-2022 08:44:25 GMT;Max-Age=31536000 | 包含auth，Path，Expires，Max-Age |



#### 查询玩家列表

- **api**   /api/v1/iidx/27/profiles/
- **method** GET
- **query**

| KEY             | VALUE                        | DESCRIPTION                                                  |
| --------------- | ---------------------------- | ------------------------------------------------------------ |
| dj_name         | GUHE                         | 可选，查询玩家的名字，默认查全部                             |
| min_access_time | 2021-03-07T06%3A00%3A05.443Z | 可选，最后活跃时间，默认查全部。url转码，左边为2021-03-07T06:00:05.443Z |
| __pos           | A0e2QzktDiU                  | 可选，默认从头查，从profiles的某个"\_id"（不含）开始查询，每次只能返回最多250条数据，可以用最后的"\_id"来查询剩余记录 |

- **response**

  ```json
  {
      "_item": [
          {
            "_links": {
              "_self": "https://arcana.nu/api/v1/iidx/27/profiles/AdhYEcTetQp",
              "dp_rivals": "https://arcana.nu/api/v1/iidx/27/profiles/?dp_rival_of=AdhYEcTetQp",
              "sp_rivals": "https://arcana.nu/api/v1/iidx/27/profiles/?sp_rival_of=AdhYEcTetQp",
              "qpro": "https://arcana.nu/api/v1/iidx/27/qpros/AdhYEcTetQp",
              "shop": "https://arcana.nu/api/v1/core/shops/DXTKTyTJhpa"
            },
            "_id": "AdhYEcTetQp",
            "_etag": "AAAAAAAAABY",
            "iidx_id": "7371-6014",
            "dj_name": "GUHE",
            "shop_id": "DXTKTyTJhpa",
            "sp": {
              "rank": "六段",
              "plays": 87,
              "dj_points": 11124
            },
            "dp": {
              "rank": null,
              "plays": 0,
              "dj_points": 1
            },
            "register_time": "2020-12-22T15:24:32.119Z",
            "access_time": "2021-03-13T10:35:07.843657Z"
          }
      ],
      "_link": {
          "_self": "https://arcana.nu/api/v1/iidx/27/profiles/?dj_name=GUHE",
          "_next": null
      },
      "_related": {
          "shops": [
              {
                "_links": {
                  "_self": "https://arcana.nu/api/v1/core/shops/DXTKTyTJhpa"
                },
                "_id": "DXTKTyTJhpa",
                "_etag": "AAAAAAAAAAI",
                "name": "爺",
                "timezone": "America/New_York"
              }
          ]
      }
  }
  ```



#### 查询玩家形象

- **api**  /api/v1/iidx/27/qpros/${\_id}

- **method** GET

- **params**

  | KEY  | VALUE       | DESCRIPTION    |
  | ---- | ----------- | -------------- |
  | _id  | AdhYEcTetQp | 必填，玩家\_id |

- **response**

  ```json
  {
      "_links": {
          "_self": "https://arcana.nu/api/v1/iidx/27/qpros/AdhYEcTetQp"
      },
      "_id": "AdhYEcTetQp",
      "_etag": "AAAAAAAAAAB",
      "head": "eto_neko",
      "hair": "eto_neko",
      "hand": "iroha",
      "face": "25nyah",
      "body": "miko"
  }
  ```
  
  响应字段值为主题名theme
  
  之后对应的图片link为：
  
  ````js
  `https://arcana.nu/asset/iidx/qpart/${theme.value}_${theme.key}/${qpparts.theme}.png`
  ````
  
  
  
  ````json
  "qpparts":{
      "head":[
          "qp_head_b",
          "qp_head_f"
      ],
      "hair":[
          "qp_hair_b",
          "qp_hair_f"
      ],
      "hand":[
          "qp_hand_l",
          "qp_hand_r"
      ],
      "face":[
          "qp_face_neutral"
      ],
      "body":[
          "qp_body_b",
          "qp_body_f",
          "qp_arm_l_upper",
          "qp_arm_l_lower",
          "qp_arm_r_upper",
          "qp_arm_r_lower",
          "qp_leg_l_upper",
          "qp_leg_l_lower",
          "qp_leg_r_upper",
          "qp_leg_r_lower",
      ]
  }
  ````
  
  叠加顺序及css为
  
  ````css
  .qpro {
      width: 170px;
      height: 200px;
      position: relative;
      float: right;
  }
  .qpro img {
      position: absolute;
      display: inline;
  }
  .qp-head-b {
      left: 14.71%;
      top: 5%;
      width: 77.06%;
      height: 88%;
  }
  .qp-hair-b {
      left: 12.94%;
      top: 5%;
      width: 77.06%;
      height: 88%;
  }
  
  /* _lower & _upper */
  .qp-leg-l {
      left: 42.65%;
      top: 61.25%;
      width: 30%;
      height: 33%;
  }
  
  /* _uppper & _lower */
  .qp-arm-r {
      left: 12.35%;
      top: 44.5%;
      width: 38.82%;
      height: 48.5%;
  }
  .qp-hand-r {
      left: 1.47%;
      top: 0;
      width: 62.35%;
      height: 88%;
  }
  /*  _lower & _uppper */
  .qp-leg-r {
      top: 61.25%;
      width: 30%;
      height: 33%;
      left: 26.47%;
  }
  /* _b & _f */
  .qp-body {
      left: 14.71%;
      top: 5%;
      width: 76.47%;
      height: 88%;
  }
  .qp-face {
      left: 29.41%;
      top: 15%;
      width: 44.17%;
      height: 39.5%;
  }
  .qp-hair-f {
      top: 5%;
      left: 12.94%;
      width: 77.06%;
      height: 88%;
  }
  .qp-head-f {
      top: 5%;
      left: 14.71%;
      width: 77.06%;
      height: 88%;
  }
  /* _upper & _lower */
  .qp-arm-l {
      top: 44.5%;
      height: 48.5%;
      left: 50%;
      width: 41.76%;
  }
  .qp-hand-l {
      left: 44.12%;
      top: 0;
      width: 47.65%;
      height: 88%;
  }
  ````
  
  ![image-20210323160823397](C:\H5\project\iidx_score_card\arcana_api.assets\image-20210323160823397.png)
  
  
  
  





#### 查询最佳成绩

- **api**  /api/v1/iidx/27/player_bests/

- **method** GET

- **query**

  | KEY        | VALUE       | DESCRIPTION                                                  |
  | ---------- | ----------- | ------------------------------------------------------------ |
  | profile_id | AdhYEcTetQp | 必填，查询玩家的名字                                         |
  | __pos      | A0e2QzktDiU | 可选，默认从头查，从profiles的某个"\_id"（不含）开始查询，每次只能返回最多250条数据，可以用最后的"\_id"来查询剩余记录 |

- **response**

  ```json
  {
      "_items": [
          {
      "_links": {
                  "_self": "https://arcana.nu/api/v1/iidx/27/player_bests/CKYhIFHYvkb",
                  "chart": "https://arcana.nu/api/v1/iidx/27/charts/EwXolM8kFAL",
                  "music": "https://arcana.nu/api/v1/iidx/27/music/Gkjeie20A_W",
                  "profile": "https://arcana.nu/api/v1/iidx/27/profiles/AdhYEcTetQp"
              },
              "_id": "CKYhIFHYvkb",
              "_etag": "AAAAAAAAAAA",
              "chart_id": "EwXolM8kFAL",
              "music_id": "Gkjeie20A_W",
              "profile_id": "AdhYEcTetQp",
              "lamp": "FAILED",
              "ex_score": 1394,
              "miss_count": 57,
              "timestamp": "2021-01-25T15:58:23.032084Z",
              "status": "FAILED"
          }
      ],
      "_links": {
          "_self": "https://arcana.nu/api/v1/iidx/27/player_bests/?profile_id=AdhYEcTetQp&__pos=CKJNXcEEUQV",
          "_next": "https://arcana.nu/api/v1/iidx/27/player_bests/?profile_id=AdhYEcTetQp&__pos=EYFo9hNvfRd"
      },
      "_related": {
          "charts" : [
              {
                  "_links": {
                      "_self": "https://arcana.nu/api/v1/iidx/27/charts/EwXolM8kFAL",
                      "music": "https://arcana.nu/api/v1/iidx/27/music/Gkjeie20A_W"
                  },
                  "_id": "EwXolM8kFAL",
                  "music_id": "Gkjeie20A_W",
                  "play_style": "SINGLE",
                  "difficulty": "ANOTHER",
                  "rating": 10,
                  "notes": 1218,
                  "bpm_min": 60,
                  "bpm_max": 143
              }
          ],
          "music": [
              {
                  "_links": {
                      "_self": "https://arcana.nu/api/v1/iidx/27/music/Gkjeie20A_W"
                  },
                  "_id": "Gkjeie20A_W",
                  "folder": 4,
                  "title": "ABSOLUTE",
                  "artist": "dj TAKA",
                  "genre": "EPIC TRANCE"
              }
          ],
          "profiles": [
              {
                  "_links": {
                      "_self": "https://arcana.nu/api/v1/iidx/27/profiles/AdhYEcTetQp",
                      "dp_rivals": "https://arcana.nu/api/v1/iidx/27/profiles/?dp_rival_of=AdhYEcTetQp",
                      "sp_rivals": "https://arcana.nu/api/v1/iidx/27/profiles/?sp_rival_of=AdhYEcTetQp",
                      "qpro": "https://arcana.nu/api/v1/iidx/27/qpros/AdhYEcTetQp",
                      "shop": "https://arcana.nu/api/v1/core/shops/DXTKTyTJhpa"
                  },
                  "_id": "AdhYEcTetQp",
                  "_etag": "AAAAAAAAABY",
                  "iidx_id": "7371-6014",
                  "dj_name": "GUHE",
                  "shop_id": "DXTKTyTJhpa",
                  "sp": {
                      "rank": "六段",
                      "plays": 87,
                      "dj_points": 11124
                  },
                  "dp": {
                      "rank": null,
                      "plays": 0,
                      "dj_points": 1
                  },
                  "register_time": "2020-12-22T15:24:32.119Z",
                  "access_time": "2021-03-13T10:35:07.843657Z"
              }
          ]
      }
  }
  ```

  

#### 获取rival列表

- **api**  /api/v1/iidx/27/rivals/${_id}

- **method** GET

- **params**

  | KEY  | VALUE       | DESCRIPTION    |
  | ---- | ----------- | -------------- |
  | _id  | AdhYEcTetQp | 必填，玩家\_id |

- **response**

  ````json
  {
      "_links": {
          "_self": "https://arcana.nu/api/v1/iidx/27/rivals/AdhYEcTetQp",
          "sp_profiles": "https://arcana.nu/api/v1/iidx/27/profiles/?sp_rival_of=AdhYEcTetQp",
          "dp_profiles": "https://arcana.nu/api/v1/iidx/27/profiles/?dp_rival_of=AdhYEcTetQp"
      },
      "_id": "AdhYEcTetQp",
      "sp_profile_ids": [
          "FKxsA6RXsvO",
          "EPCsp47TVTg",
          "BG7DfW6JgXV",
          "E7qF1sHSPkJ"
      ],
      "dp_profile_ids": []
  }
  ````

#### 添加/删除rival

A网添加/删除rival的逻辑是查询rival_id是否在自己_id的rival列表里，有就删，没有就添加，上传新的rival列表覆盖

由于添加/删除rival接口目前看来同样不需要登录，不安全，因此不实装，仅提供rival页面跳转，自助修改

https://arcana.nu/iidx/27/profiles/${rival_id}/



- **api**  /api/v1/iidx/27/rivals/${_id}

- **method** PUT

- **params**

  | KEY  | VALUE       | DESCRIPTION    |
  | ---- | ----------- | -------------- |
  | _id  | AdhYEcTetQp | 必填，玩家\_id |

- **payload**

````json
{
    "sp_profile_ids":[
        "FKxsA6RXsvO",
        "EPCsp47TVTg",
        "BG7DfW6JgXV",
        "E7qF1sHSPkJ",
        "FHpW_xVYFFf"
    ],
    "dp_profile_ids":[
        
    ]
}
````

