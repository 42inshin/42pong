import { User } from "src/Entitys/user.entity";

export class GameData {
  left_user: number;
  right_user: number;
  ball_x: number;
  ball_y: number;
  ball_vec_x: number;
  ball_vec_y: number;
  ball_speed: number;
  score: [number, number];
  mode: number;
  hitPlayer: number;
  onGame: boolean;

  constructor() {
    (this.left_user = 300), (this.right_user = 300), (this.ball_x = 350), (this.ball_y = 250), (this.ball_speed = 8), (this.ball_vec_x = 5), (this.ball_vec_y = 0), (this.score = [0, 0]), (this.mode = 0), (this.hitPlayer = 0), (this.onGame = false);
  }

  public reset() {
    this.ball_x = 350;
    this.ball_y = 250;
    this.ball_vec_y = 0;
    this.ball_speed = 8;
  }

  update() {
    let collidePoint: number;
    let angleRad: number;

    this.ball_x += this.ball_vec_x;
    this.ball_y += this.ball_vec_y;

    if (this.mode == 2) {
      if (this.hitPlayer == 0) {
        if (this.ball_x > 350) {
          this.ball_y = 500 - this.ball_y;
          this.ball_vec_y *= -1;
          this.hitPlayer = 1;
        }
      }
      if (this.hitPlayer == 1) {
        if (this.ball_x < 350) {
          this.ball_y = 500 - this.ball_y;
          this.ball_vec_y *= -1;
          this.hitPlayer = 0;
        }
      }
    }

    if (this.ball_y - 11 < 0) {
      if (this.ball_vec_y < 0) this.ball_vec_y = -this.ball_vec_y;
    } else if (this.ball_y + 11 > 500) {
      if (this.ball_vec_y > 0) this.ball_vec_y = -this.ball_vec_y;
    }

    if (this.ball_x - 11 < 0) {
      if (this.ball_y >= this.left_user && this.ball_y <= this.left_user + 100) {
        collidePoint = (this.ball_y - (this.left_user + 50)) / 50;
        angleRad = (Math.PI / 4) * collidePoint;
        this.ball_vec_x = this.ball_speed * Math.cos(angleRad);
        this.ball_vec_y = this.ball_speed * Math.sin(angleRad);
        if (this.ball_speed < 25) {
          this.ball_speed += 0.2;
        }
      } else {
        this.score[1]++;
        this.ball_vec_x = -5;
        this.reset();
      }
    } else if (this.ball_x + 11 > 700) {
      if (this.ball_y >= this.right_user && this.ball_y <= this.right_user + 100) {
        collidePoint = (this.ball_y - (this.right_user + 50)) / 50;
        angleRad = (Math.PI / 4) * collidePoint;
        this.ball_vec_x = -1 * this.ball_speed * Math.cos(angleRad);
        this.ball_vec_y = this.ball_speed * Math.sin(angleRad);
        if (this.ball_speed < 25) {
          this.ball_speed += 0.2;
        }
      } else {
        this.score[0]++;
        this.ball_vec_x = 5;
        this.reset();
      }
    }
  }

  setMode(mode: number) {
    this.mode = mode;
  }
}
