/**
 * @api {post} /channel 채널만들기
 *
 * @apiVersion        1.0.0
 * @apiName makeChannel
 * @apiGroup Channel
 *
 * @apiBody {String} name exmaple) 자동으로 채널 참가도 함
 * @apiBody {String} type exmaple) "public" | "private".
 * @apiBody {String} password exmaple) 타입이 public이면 password는 자동으로 ""처리 .
 * @apiBody {String} ownerId exmaple) "76328" -> 42서울의 id값 .
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 Created
 *      {
 *          "name": "this is test make channel",
 *          "password": "",
 *          "type": "public",
 *          "owner": {
 *              "id": "76328",
 *              "nickname": "sanghpar",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76328",
 *              "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          },
 *          "id": 84,
 *          "createdAt": "2022-08-01T19:57:21.036Z"
 *      }
 */

/**
 * @api {post} /channel/participant 채널 참가
 *
 * @apiVersion        1.0.0
 * @apiName addParticipant
 * @apiGroup Channel
 *
 * @apiBody {Number} channel_id 접속할 채널의 id ex)84.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 Created
 *      {
 *          "admin": false,
 *          "muted": false,
 *          "user": {
 *              "id": "76328",
 *              "nickname": "sanghpar",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76328",
 *              "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          },
 *          "channel": {
 *              "id": 84,
 *              "name": "this is test make channel",
 *              "type": "public",
 *              "password": "",
 *              "createdAt": "2022-08-01T19:57:21.036Z"
 *          },
 *          "id": 2,
 *          createdAt": "2022-08-01T20:06:35.489Z"
 *      }
 *
 */

/**
 * @api {post} /channel/admin 채널 관리자 권한
 *
 * @apiVersion        1.0.0
 * @apiName giveAdmin
 * @apiGroup Channel
 *
 * @apiBody {String} user_id 관리자를 제어당할 user_id ex)76328.
 * @apiBody {String} channel_id 해당 채널의 channel_id ex)84.
 * @apiBody {Boolean} value 해당 권한의 Boolean값 ex)84.
 *
 * @apiSuccessExample Success-Response: 성공시 particiapnt반납
 *      HTTP/1.1 201 Created
 *      {
 *           "id": 1,
 *           "admin": false,
 *           "muted": false,
 *           "createdAt": "2022-08-01T19:57:21.045Z"
 *      }
 *
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 409 Conflict
 *      {
 *          "statusCode": 409,
 *          "message": "user_id don't belong in channle_id"
 *      }
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "user is not owner"
 *      }
 */

/**
 * @api {post} /channel/muted 음소거 부여(10초)
 *
 * @apiVersion        1.0.0
 * @apiName giveMuted
 * @apiGroup Channel
 *
 * @apiBody {String} user_id 음소거를 제어당할 user_id ex)76328.
 * @apiBody {String} channel_id 해당 채널의 channel_id ex)84.
 * @apiBody {Boolean} value 해당 권한의 Boolean값 ex)84.
 *
 * @apiSuccessExample Success-Response: 성공시 particiapnt반납
 *      HTTP/1.1 201 Created
 *      {
 *           "id": 1,
 *           "admin": false,
 *           "muted": false,
 *           "createdAt": "2022-08-01T19:57:21.045Z"
 *      }
 *
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 409 Conflict
 *      {
 *          "statusCode": 409,
 *          "message": "user_id don't belong in channle_id"
 *      }
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "fail muted / need Grant"
 *      }
 */

/**
 * @api {get} /channel/participants/:channel_id 해당채널 모든 참가자 가져오기
 *
 * @apiVersion        1.0.0
 * @apiName getAllParticipants
 * @apiGroup Channel
 *
 *
 *
 * @apiSuccessExample Success-Response: 성공시 particiapnt[]반납
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "id": 2,
 *              "admin": false,
 *              "muted": false,
 *              "createdAt": "2022-08-01T20:06:35.489Z",
 *              "user": {
 *                  "id": "76328",
 *                  "nickname": "sanghpar",
 *                  "win": 0,
 *                  "lose": 0,
 *                  "ladder_win": 0,
 *                  "ladder_lose": 0,
 *                  "admin": false,
 *                  "avatarPath": "users/avatar/76328",
 *                  "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *                  "isTwoFactorAuthenticationEnabled": false,
 *                  "lating": 1000
 *              }
 *          },
 *          {
 *              ....
 *          }
 *      ]
 */

/**
 * @api {post} /channel/password 채널 비밀번호 생성
 *
 * @apiVersion        1.0.0
 * @apiName changePassword
 * @apiGroup Channel
 *
 * @apiBody {Number} channel_id 채널id
 * @apiBody {Number} password 바꿀 비밀번호
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 created
 *      {
 *          "id": 84,
 *          "name": "this is test make channel",
 *          "type": "private",
 *          "password": "$2b$10$klrc2HgeDml5/CJZxtriHu7vfrxaNHAA865J/eKncP5UV7W8O1du.",
 *          "createdAt": "2022-08-01T19:57:21.036Z"
 *      }
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "user is not owner"
 *      }
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "password is invalid"
 *      }
 */

/**
 * @api {delete} /channel/password 채널 비밀번호 제거
 *
 * @apiVersion        1.0.0
 * @apiName deletePassword
 * @apiGroup Channel
 *
 * @apiBody {Number} channel_id 채널id
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 created
 *      {
 *          "id": 84,
 *          "name": "this is test make channel",
 *          "type": "public",
 *          "password": "",
 *          "createdAt": "2022-08-01T19:57:21.036Z"
 *      }
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "user is not owner"
 *      }
 */

/**
 * @api {patch} /channel/password 채널 비밀번호 변경
 *
 * @apiVersion        1.0.0
 * @apiName patchPassword
 * @apiGroup Channel
 *
 * @apiBody {Number} channel_id 채널id
 * @apiBody {Number} password 바꿀 비밀번호
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 created
 *      {
 *          "id": 84,
 *          "name": "this is test make channel",
 *          "type": "private",
 *          "password": "$2b$10$klrc2HgeDml5/CJZxtriHu7vfrxaNHAA865J/eKncP5UV7W8O1du.",
 *          "createdAt": "2022-08-01T19:57:21.036Z"
 *      }
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "user is not owner"
 *      }
 *      HTTP/1.1 400 BadRequestException  //public은 비밀번호 변경 불가
 *      {
 *          "statusCode": 400,
 *          "message": "public can't have password"
 *      }
 */
