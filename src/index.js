window.addEventListener('load', function (event) {
    const canvas = document.querySelector('.canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;


    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', event => {
                if (!(this.game.keys.includes(event.key))) {
                    this.game.keys.push(event.key)
                }

                if (event.key == ' ') {
                    this.game.player.shootTop();
                    console.log('shoot')
                }

                if (event.key == 'd') this.game.debug = !this.game.debug;
                console.log(this.game.keys);
            })

            window.addEventListener('keyup', event => {
                if (this.game.keys.includes(event.key)) {
                    this.game.keys = this.game.keys.filter( key => key !== event.key)
                }
                console.log(this.game.keys);
            })
        }
    }
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x; 
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 5;
            this.markedForDeletion = false;
            this.image = document.querySelector('.projectile');
        }

        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }

        draw(context) {
            context.fillStyle = 'black';
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

    }
    class Particle {}

    class Player {

        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.image = document.querySelector('.player');


            this.speedY = 0;
            this.maxSpeed = 5;
            this.projectiles = [];
            this.lives = 5;

        }

        update() {
            if (this.game.keys.includes('ArrowUp') || this.game.keys.includes('ArrowDown')) {
                this.game.keys.indexOf('ArrowUp') > this.game.keys.indexOf('ArrowDown') ? this.speedY = - this.maxSpeed : this.speedY = this.maxSpeed
            } else this.speedY = 0;
            this.y += this.speedY;



            this.projectiles.forEach(projectile => projectile.update())
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion)

            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX ++

        }

        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            this.projectiles.forEach( projectile => projectile.draw(context))
        }

        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 100, this.y + 20))
                this.game.ammo--;
                console.log(`Ammo: ${this.game.ammo}`);
            }
        } 

    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = (Math.random() * - 1.5) - 0.5; // Random speed between -0.5 and -2
            this.markedForDeletion = false;
            this.lives = 3;
            this.score = this.lives;
            this.frameX = 0;
            this.maxFrameX = 37;
        }

        update() {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            if (this.frameX < this.maxFrameX) this.frameX++;
            else this.frameX = 0;
        }

        draw(context) {
            if (this.game.debug) {
                context.fillStyle = 'white';
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.font = '20px helvetica';
                context.fillText(this.lives, this.x + 5, this.y - 5);
            }
            context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
    }

    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.lives = 5;
            this.image = document.querySelector('.angler2');
            this.y = Math.random() * (this.game.height - this.height);            
            this.frameY = Math.floor(Math.random() * 2)
           
        }
       
    }

    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;

            this.image = document.querySelector('.angler1');
            this.y = Math.random() * (this.game.height - this.height);
            this.frameY = Math.floor(Math.random() * 3)
           
        }
    }
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.x = 0;
            this.y = 0;
            this.width = 1768;
            this.height = 500;
        }

        update() {
            if (this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y); 
            context.drawImage(this.image, this.x + this.width, this.y); 
        }
    }
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.querySelector('.layer1');
            this.image2 = document.querySelector('.layer2');
            this.image3 = document.querySelector('.layer3');
            this.image4 = document.querySelector('.layer4');
            this.layer1 = new Layer(game, this.image1, 1)
            this.layer2 = new Layer(game, this.image2, 2)
            this.layer3 = new Layer(game, this.image3, 3)
            this.layer4 = new Layer(game, this.image4, 4)
            this.layers = [this.layer1, this.layer2, this.layer3,];
            console.log(this.layers)
        }

        update() {
            this.layers.forEach(layer => layer.update())
        }

        draw(context) {
            this.layers.forEach(layer => {
                layer.draw(context);
            })
        }
    }
    
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white ';
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 3;
            context.shadowOffsetY = 3;
            context.shadowColor = 'black';
            context.shadowBlur = 5;
            context.font = `${this.fontSize}px ${this.fontFamily}`;
            context.fillText(`Score: ${this.game.score}`, 20, 40);
            context.fillText(`Lives: ${this.game.player.lives}`, 160, 40);


            
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + (i*5), 50, 3, 20);
            }


            if (this.game.gameOver) {
                let message
                if (this.game.score > this.game.winningScore) message = 'WINNER'
                else message = 'LOOSER!'

                context.fillStyle = 'white'
                context.font = '50px Helvetica'
                context.textAlign = 'center';
                context.fillText(message, this.game.width / 2, this.game.height / 2);
                
            }

            if (!this.game.gameOver) {
                context.font = "20px Helevetica";
                context.fillText(`Time: ${((this.game.gameTimeLimit - this.game.gameTimer) / 1000).toFixed(2)}`, this.game.width - 100, 40);
            }

            context.restore();
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;

            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500;

            this.keys = new Array();
            this.player = new Player(this);
            this.inputHandler = new InputHandler(this);
            this.ui = new UI(this);
            this.background = new Background(this);
            
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.enemies = [];

            this.score = 0;
            this.winningScore = 10;
            this.gameOver = false;

            this.gameTimer = 0;
            this.gameTimeLimit = 60000;
            this.speed = 0.3;

            this.debug = false;
        } 

        update(deltaTime) {

            if (!this.gameOver) this.gameTimer += deltaTime;
            if (this.gameTimer > this.gameTimeLimit) this.gameOver = true;

            this.background.update();
            this.background.layer4.update();
            this.player.update(); 
            this.ammoTimer += deltaTime;
            if ((this.ammoTimer > this.ammoInterval) && (this.ammo < this.maxAmmo)) {
                this.ammo++;
                this.ammoTimer = 0;
            }

            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {   
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            // console.log(this.enemies);
            this.enemies.forEach(enemy => {
                if (this.hasCollided(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                    if (this.player.lives) this.player.lives--;
                };
                this.player.projectiles.forEach(projectile => {
                    if (this.hasCollided(projectile, enemy)) {
                        projectile.markedForDeletion = true;
                        enemy.lives--;
                        if (enemy.lives === 0) {
                            enemy.markedForDeletion = true;
                            if (!this.gameOver) this.score += enemy.score;
                            // console.log(this.score);
                        
                        }
                    }
                })
            })

            if (this.player.lives == 0) this.gameOver = true;
            this.enemies.forEach(enemy => enemy.update());
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

        } 

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.background.layer4.draw(context);
        }

        addEnemy() {
            const random = Math.random();
            random < 0.5 ? this.enemies.push(new Angler1(this)) : this.enemies.push(new Angler2(this))
            console.log(this.enemies)
        }

        hasCollided(rect1, rect2) {
            return (
                rect1.x + rect1.width > rect2.x &&
                rect1.x < rect2.x + rect2.width &&
                rect1.y + rect1.height > rect2.y &&
                rect1.y < rect2.y + rect2.height
            );
        }

    }

    const game = new Game(canvas.width, canvas.height);

    // animation loop
    let currentTimeStamp = 0;
    function animate(timestamp) {
        const deltaTime = timestamp - currentTimeStamp;
        currentTimeStamp = timestamp;
        context.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(context);
        requestAnimationFrame(animate);
    }
    animate(0);

})