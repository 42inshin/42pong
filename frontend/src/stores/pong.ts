class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  ball_x: number;
  ball_y: number;

  left_user: number;
  right_user: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = 700;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.ball_x = 350;
    this.ball_y = 250;

    this.left_user = 250;
    this.right_user = 250;
  }

  // reset(){
  // 	this.ball_x = 350;
  // 	this.ball_y = 250;
  // 	this.ball_vec_y = 0;

  // 	this.ball_speed = 8;
  // }

  // update(){
  // 	var	collidePoint: number;
  // 	var	angleRad: number;

  // 	this.ball_x += this.ball_vec_x;
  // 	this.ball_y += this.ball_vec_y;

  // 	this.right_user += ((this.ball_y - (this.right_user + 50/2)))*0.2;

  // 	if(this.ball_y - 11 < 0)
  // 	{
  // 		if(this.ball_vec_y < 0)
  // 			this.ball_vec_y = -this.ball_vec_y;
  // 	}
  // 	else if(this.ball_y + 11 > 500)
  // 	{
  // 		if(this.ball_vec_y > 0)
  // 			this.ball_vec_y = -this.ball_vec_y;
  // 	}

  // 	if(this.ball_x - 11 < 0)
  // 	{
  // 		if(this.ball_y >= this.left_user && this.ball_y <= this.left_user + 100)
  // 		{
  // 			collidePoint = (this.ball_y - (this.left_user + 50)) / 50;
  // 			angleRad = (Math.PI/4) * collidePoint;
  // 			this.ball_vec_x = this.ball_speed * Math.cos(angleRad);
  // 			this.ball_vec_y = this.ball_speed * Math.sin(angleRad);
  // 			this.ball_speed += 0.2;
  // 		}
  // 		else
  // 			this.reset();
  // 	}
  // 	else if(this.ball_x + 11 > 700)
  // 	{
  // 		if(this.ball_y >= this.right_user && this.ball_y <= this.right_user + 100)
  // 		{
  // 			collidePoint = (this.ball_y - (this.right_user + 50)) / 50;
  // 			angleRad = (Math.PI/4) * collidePoint;
  // 			this.ball_vec_x = -1 * this.ball_speed * Math.cos(angleRad);
  // 			this.ball_vec_y = this.ball_speed * Math.sin(angleRad);
  // 			this.ball_speed += 0.2;
  // 		}
  // 		else
  // 			this.reset();
  // 	}
  // }

  drawPaddle() {
    this.ctx.fillStyle = "#B8302C";
    this.ctx.fillRect(0, this.left_user + 6, 12, 88);

    this.ctx.beginPath();
    this.ctx.arc(6, this.left_user + 6, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(6, this.left_user + 94, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "#222222";
    this.ctx.fillRect(688, this.right_user + 6, 12, 88);

    this.ctx.beginPath();
    this.ctx.arc(694, this.right_user + 6, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(694, this.right_user + 94, 6, 0, Math.PI * 2);
    this.ctx.fill();
    // console.log(this.left_user);
  }

  drawBall() {
    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.arc(this.ball_x, this.ball_y, 11, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawBack() {
    this.ctx.fillStyle = "#1D9E9F";
    this.ctx.fillRect(0, 0, 700, 500);
  }

  drawNet() {
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(348, 0, 4, 500);
  }

  drawPortal() {
    this.ctx.fillStyle = "rgba(30,144,255, 1)";
    this.ctx.fillRect(344, 0, 6, 500);
    this.ctx.fillStyle = "rgba(255,69,0, 1)";
    this.ctx.fillRect(350, 0, 6, 500);
  }

  render() {
    this.drawBack();
    this.drawNet();
    this.drawBall();
    this.drawPaddle();
  }

  game(data: any) {
    this.left_user = data.left_user;
    this.right_user = data.right_user;
    this.ball_x = data.ball_x;
    this.ball_y = data.ball_y;

    this.render();
    if (data.mode == 2) this.drawPortal();
  }
}

// const canvas = document.getElementById("pong") as HTMLCanvasElement;;
// canvas.addEventListener("mousemove", getMousePos);

// function getMousePos(evt: MouseEvent) : number {
// 	// let rect = this.canvas.getBoundingClientRect();

// 	return evt.clientY ;

// 	// console.log(this.left_user);
// }

export default Game;
