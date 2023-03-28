$(function () {

    class Enemy {
        id = 0;
        x_coordinate = 0;
        y_coordinate = 0;
        health = 100;
        damage = 5;


        move() {
            console.log("move e");
            game.draw()
        }
    }

    class Player {
        x_coordinate = 0;
        y_coordinate = 0;
        health = 100;
        damage = 10;

        checkColl(x_val, y_val) {
            if (x_val !== 0) {
                if (this.x_coordinate + x_val >= game.screen_width || this.x_coordinate + x_val < 0) {
                    return true
                }
                else if (game.field_arr[this.y_coordinate][this.x_coordinate + x_val] === 0) {
                    return true;
                }
            }
            else {
                if (this.y_coordinate + y_val > game.screen_height || this.y_coordinate + y_val < 0) {
                    return true
                }
                else if (game.field_arr[this.y_coordinate + y_val][this.x_coordinate] === 0) {
                    return true;
                }
            }
            return false
        }

        move(key) {
            let x_val = 0;
            let y_val = 0;

            if (key === 'KeyW') {
                y_val = -1;
            }
            else if (key === 'KeyS') {
                y_val = 1;
            }
            else if (key === 'KeyA') {
                x_val = -1;
            }
            else if (key === 'KeyD') {
                x_val = 1;
            }
            else if (key === 'Space') {
                game.checkCombat(game.enemies, this, true);
            }
            if (x_val !== 0 || y_val !== 0) {
                if (!this.checkColl(x_val, y_val)) {
                    if (game.field_arr[this.y_coordinate + y_val][this.x_coordinate + x_val] === 3) {
                        this.damage += 10;
                    } else if (game.field_arr[this.y_coordinate + y_val][this.x_coordinate + x_val] === 4) {
                        if (this.health !== 100) {
                            this.health += 20;
                            if (this.health > 100){
                                this.health = 100;
                            }
                        } else {
                            alert("full health");
                        }
                    }

                    if (game.field_arr[this.y_coordinate + y_val][this.x_coordinate + x_val] !== 5) {
                        game.field_arr[this.y_coordinate][this.x_coordinate] = 1;
                        this.x_coordinate += x_val;
                        this.y_coordinate += y_val;
                        game.field_arr[this.y_coordinate][this.x_coordinate] = 2;
                    }

                    game.draw();
                    // game.checkCombat();
                }
                else {
                    console.log("not ok");
                }
            }
        }
    }

    class Game {
        player = new Player();
        enemies = []
        screen_width = 32;
        screen_height = 16;

        field_arr = []

        init() {

            for (let i = 0; i < this.screen_height; ++   i) {
                let field_arr_x = []
                for (let j = 0; j < this.screen_width; ++j) {
                    field_arr_x.push(0);
                }
                this.field_arr.push(field_arr_x);
            }

            let passages_x = []
            let passages_y = []

            while (passages_x.length < 4) {
                let r_val = getRandomIntInclusive(1, 15);
                if (passages_x.indexOf(r_val) === -1) passages_x.push(r_val);
            }
            while (passages_y.length < 4) {
                let r_val = getRandomIntInclusive(1, 31);
                if (passages_y.indexOf(r_val) === -1) passages_y.push(r_val);
            }

            for (let i = 0; i < this.screen_height; ++i) {
                for (let j = 0; j < this.screen_width; ++j) {
                    if (passages_x.indexOf(i) !== -1 || passages_y.indexOf(j) !== -1) {
                        this.field_arr[i][j] = 1;
                    }
                }
            }


            this.generate_rooms();
            this.generate_items();
            this.generate_enemies();
            this.generate_player();
            this.draw();

            document.addEventListener('keydown', function (event) {
                game.player.move(event.code)
            });

            setInterval(this.checkCombat, 1000, this.enemies, this.player, false);

        }

        generate_enemies() {
            let enemy_num = getRandomIntInclusive(4, 6);
            let enemy_id = 0;
            while (enemy_num > 0) {
                let x = getRandomIntInclusive(1, 31);
                let y = getRandomIntInclusive(1, 15);

                if (this.field_arr[y][x] === 1) {
                    this.field_arr[y][x] = 5;

                    let enemy = new Enemy();
                    enemy.x_coordinate = x;
                    enemy.y_coordinate = y;
                    enemy.id = enemy_id;

                    this.enemies.push(enemy);

                    enemy_num -= 1;
                    enemy_id += 1;
                }
            }
        }

        generate_player() {
            while (true) {
                let x = getRandomIntInclusive(1, 31);
                let y = getRandomIntInclusive(1, 15);

                if (this.field_arr[y][x] === 1) {
                    this.player.x_coordinate = x;
                    this.player.y_coordinate = y;
                    this.field_arr[y][x] = 2;
                    break;
                }
            }
        }

        generate_rooms() {
            let num_of_rooms = getRandomIntInclusive(2, 6);

            for (let room_num = 0; room_num < num_of_rooms; ++room_num) {
                let room_height = getRandomIntInclusive(2, 4);
                let room_width = getRandomIntInclusive(4, 8);

                while (true) {
                    let room_coordinate_x_center = getRandomIntInclusive(Math.floor(1 + room_width / 2), 31 - room_width / 2);
                    let room_coordinate_y_center = getRandomIntInclusive(1 + room_height, 15 - room_height);
                    // можно здесь просто сделать так, чтобы он сразу брал подходящие координаты внутри экрана
                    // типо нужно чекать размеры и ориентировааться от них

                    if (this.field_arr[room_coordinate_y_center][room_coordinate_x_center] === 1) {

                        let room_coordinate_y = Math.floor(room_coordinate_y_center - (room_height / 2));

                        // console.log(room_num, [room_coordinate_x_center, room_coordinate_y_center], [room_width, room_height]);

                        while (room_coordinate_y < Math.floor(room_coordinate_y_center + (room_height / 2))) {

                            let room_coordinate_x = Math.floor(room_coordinate_x_center - (room_width / 2));

                            while (room_coordinate_x < Math.floor(room_coordinate_x_center + (room_width / 2))) {

                                this.field_arr[room_coordinate_y][room_coordinate_x] = 1;

                                room_coordinate_x += 1;
                            }

                            room_coordinate_y += 1;
                        }

                        break;
                    }
                }
            }
        }

        generate_items() {
            let swords_num = 2;
            let potions_num = 2;
            while (swords_num !== 0 || potions_num !== 0) {
                let x = getRandomIntInclusive(1, 31);
                let y = getRandomIntInclusive(1, 15);

                if (this.field_arr[y][x] === 1) {
                    if (swords_num !== 0) {
                        this.field_arr[y][x] = 3;
                        swords_num -= 1;
                    }
                    else {
                        this.field_arr[y][x] = 4;
                        potions_num -= 1;
                    }
                }

            }
        }

        checkCombat(enemies, player, isHit) {
            let enemies_near = []
            for (let i = 0; i < enemies.length; ++i) {
                let r = Math.floor(Math.sqrt(Math.pow((enemies[i].x_coordinate - player.x_coordinate), 2) +
                    Math.pow((enemies[i].y_coordinate - player.y_coordinate), 2)));
                if (r < 2) {
                    enemies_near.push(enemies[i]);
                }
            }

            let combat = false;
            for (let i = 0; i < enemies_near.length; ++i) {
                if (!combat)
                    combat = !combat;

                if (isHit) {
                    enemies_near[i].health -= player.damage;
                    if (enemies_near[i].health <= 0) {
                        game.enemies.splice(game.enemies.indexOf(enemies_near[i]), 1);
                        game.field_arr[enemies_near[i].y_coordinate][enemies_near[i].x_coordinate] = 1;
                    }
                }
                else {
                    player.health -= enemies_near[i].damage;
                    if (player.health <= 0){
                        alert("GAME OVER");
                    }
                }
            }

            if (combat)
                game.draw();
        }

        draw() {
            $('.wrapper').empty();
            for (let i = 0; i < this.screen_height; ++i) {
                for (let j = 0; j < this.screen_width; ++j) {
                    if (this.field_arr[i][j] === 0){
                        $(".field.wrapper").append('<div class="field tileW"></div>');
                    }
                    else if (this.field_arr[i][j] === 1) {
                        $(".field.wrapper").append('<div class="field tile"></div>');
                    }
                    else if (this.field_arr[i][j] === 2) {
                        let s = `<div class="field tileP"><div class="health" style="width: ${this.player.health}%"></div></div>`
                        $(".field.wrapper").append(s);
                    }
                    else if (this.field_arr[i][j] === 3) {
                        $(".field.wrapper").append('<div class="field tileSW"></div>');
                    }
                    else if (this.field_arr[i][j] === 4) {
                        $(".field.wrapper").append('<div class="field tileHP"></div>');
                    }
                    else if (this.field_arr[i][j] === 5) {
                        let enemy_id = 0;
                        let enemy_health = 100;
                        for (let enemy = 0; enemy < this.enemies.length; ++enemy) {
                            if (i === this.enemies[enemy].y_coordinate && j === this.enemies[enemy].x_coordinate) {
                                enemy_id = this.enemies[enemy].id;
                                enemy_health = this.enemies[enemy].health;
                                break;
                            }
                        }
                        let s = `<div id=${enemy_id} class="field tileE"><div class="health" style="width: ${enemy_health}%"></div></div>`
                        $(".field.wrapper").append(s);
                    }
                }
                $(".field.wrapper").append('<br>')
            }

        }

    }

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let game = new Game();
    game.init();

});