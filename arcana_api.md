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



#### 查询最佳成绩

- **api**  /api/v1/iidx/27/player_bests/

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

  