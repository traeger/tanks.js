/*
Licensed under The MIT License (MIT)
Copyright (c) 2014 Marco Träger <marco.traeger at googlemail.com>
      and (c) 2014 Ilja Klebanov
This file is part of the game tanks.js (https://github.com/traeger/tanks.js).

The enchant.js and resource files, such as images, are provided by other 
authors and are listed in the LICENSE file.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

enchant();

var config = {
  speed: 1.2,
  rotspeed: 3,
  life: 3,
  ammu: 3,
  shotspeed: 5,
  shotdist: 900,
  shotbreak: 12,
  start_1: {x:700, y:120},
  start_2: {x:50, y:120},
  map: map_ilja,
  footer: 13
};

var debug = {};
var stage = new Group();
var map

window.onload = function() {
  game = new Game(config.map.width*16, config.map.height*16 + config.footer);
  game.fps = 48;
  game.touched = false;
  game.preload('shot.png', 'map1.gif', 'MulticolorTanks.png', 'effect0.gif');
  game.onload = function() {
    map = new Map(16, 16);
    // map
    {
      map.image = game.assets['map1.gif'];

      var loadmap = function(lines) {
        return lines.map(function(line) { return line.split('').map( function(v) {return parseInt(v); }); });
      };
      var f_ground = function(v) {
        return 55; //322;
      };
      var f_obstacles = function(v) {
        return v ? 320 : -1;
      };

      var mapdata = loadmap(config.map.data);
      var ground = mapdata.map(function(line) {
        return line.map(f_ground);
      });
      var obstacles = mapdata.map(function(line) {
        return line.map(f_obstacles);
      });
    }

    map.loadData(ground, obstacles);
    map.collisionData = mapdata;

    player_1 = new Player(config.start_1.x, config.start_1.y, 1);
    player_2 = new Player(config.start_2.x, config.start_2.y, 2);
    players = [player_1, player_2];
    
    game.rootScene.backgroundColor = 'black';
    game.rootScene.addEventListener('enterframe', function() {
      scoreLabel_1.setText([player_1.life]);
      scoreLabel_2.setText([player_2.life]);
      scoreLabel.setText([player_2.score, player_1.score]);
    });
    
    game.rootScene.addChild(map);
    game.rootScene.addChild(stage);
    
    // fst player control
    game.keybind(37, 'left_1');  // left	
    game.keybind(39, 'right_1'); // right
    game.keybind(38, 'up_1');    // up
    game.keybind(40, 'down_1');  // down
    game.keybind(18, 'shoot_1'); // alt
    
    // snd player control
    game.keybind(65, 'left_2');  // a	
    game.keybind(68, 'right_2'); // d
    game.keybind(87, 'up_2');    // w
    game.keybind(83, 'down_2');  // s
    game.keybind(86, 'shoot_2'); // v
    
    var scoreLabel_2 = new ScoreBoard(['LIFE ',''], game, 8, config.map.height*16-16, 'left');
    var scoreLabel_1 = new ScoreBoard(['',' LIFE'], game, (config.map.width*16-300)-8, config.map.height*16-16, 'right');
    var scoreLabel = new ScoreBoard(['',' : '], game, (config.map.width*16-300)/2, config.map.height*16-16, 'center');
    game.show_controlhelp('up/left/down/right/alt', (config.map.width*16-300)-8, config.map.height*16, 'right');
    game.show_controlhelp('w/a/s/d/v', 8, config.map.height*16, 'left');
  };
  game.reset = function() {
    player_1._dirty = true;
    player_2._dirty = true;
    
    player_1.x = config.start_1.x;
    player_1.y = config.start_1.y;
    player_2.x = config.start_2.x;
    player_2.y = config.start_2.y;
    player_1.life = config.life;
    player_2.life = config.life;
    player_1._rotation = 0;
    player_2._rotation = 0;
  };
  game.show_controlhelp = function(text, x, y, pos) {
  	label = new Label();
    label.text = text;
  
  	label.x = x;
  	label.y = y;        
  	label.color = 'white';
  	label.font = '10px strong';
  	label.textAlign = pos;
  	label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
  	this.rootScene.addChild(label);
  }
  
  game.start();
};

var ScoreBoard = function(labeltext, game, x, y, pos) {
  this.label = new Label();
  this.labeltext = labeltext;
  
  this.label.x = x;
  this.label.y = y;        
  this.label.color = 'white';
  this.label.font = '15px strong';
  this.label.textAlign = pos;
  this.label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
  
  game.rootScene.addChild(this.label);
};
ScoreBoard.prototype.setText = function(text) {
  var s = this.labeltext[0];
  for(var i = 0, len = text.length; i < len; i++) {
    s += text[i];
    if(!!this.labeltext[i+1]) 
      s += this.labeltext[i+1];
  }
  this.label.text = s;
};
String.prototype.repeat = function( num ) {
  return new Array( num + 1 ).join( this );
}

var Player = enchant.Class.create(enchant.Sprite, {
  initialize: function(x, y, playernumber) {
    this.number = playernumber;
    
    enchant.Sprite.call(this, 16, 16);
    this.r = 12 / 2;
    this.shots = 0;
    this.life = config.life;
    this.score = 0;
    this.image = game.assets['MulticolorTanks.png'];
    
    this.x = x;
    this.y = y;
    
    // frame of the last shot
    this.lastshot = 0;

    this.frame = (this.number-1)*8;
    //this.frame = [0,1,2,3,4,5,6];
    
    this.centerx = function() {
      return this.x + this.width/2;
    };

    this.centery = function() {
      return this.y + this.height/2;
    };

    this.addEventListener('enterframe', function() {
      if (game.input['shoot_'+this.number] && game.frame > this.lastshot + config.shotbreak && this.shots < config.ammu) {
        this.lastshot = game.frame;
        var s = new PlayerShoot(this, 
          this.centerx() + Math.cos(this.rotation / 180 * Math.PI) * 10, 
          this.centery() + Math.sin(this.rotation / 180 * Math.PI) * 10, 
          this.rotation / 180 * Math.PI
        );
      }
      
      var rot = config.rotspeed;
      if (game.input['down_'+this.number]) {rot*=-1;}
      if (game.input['left_'+this.number]) {
        this.rotate(-rot);
      } else if (game.input['right_'+this.number]) {
        this.rotate( rot);
      }

      var speed = config.speed;
      if (game.input['up_'+this.number] || game.input['down_'+this.number]) {
        if(game.input['down_'+this.number]) 
          speed *= -1;
        
        var r = this.rotation / 180 * Math.PI;

        var dx = speed * Math.cos(r);
        var dy = speed * Math.sin(r);

        if (!hittest(map, this.centerx() + dx, this.centery() + dy, this.r)) {
          this.moveBy(dx, dy);
        }
      }
    });
    stage.addChild(this);
  },
  lossLife: function(source) {
    this.life -= 1;
    if(this.life <= 0)
      this.kill(source);
  },
  kill: function(killer) {
    if(killer != this) {
      killer.score++;
    }
    else {
      this.score--;
      if(this.score < 0) this.score = 0;
    }
    
    console.log('killed');
    
    var explosion = new enchant.Sprite(16, 16);
    explosion.image = game.assets['effect0.gif'];
    var frame = [ 0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
      2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
      3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
      4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
    explosion.frame = frame;
    explosion.removeat = game.frame + frame.length;
    explosion.x = this.x;
    explosion.y = this.y;
    explosion.addEventListener('enterframe', function() {
      if(game.frame >= this.removeat) {
        stage.removeChild(this);
        delete this;
        game.reset();
      }
    });
    this.x = -100;
    this.y = -100;
    
    stage.addChild(explosion);
  }
});

var Shoot = enchant.Class.create(enchant.Sprite, {
  initialize: function(owner, x, y, direction) {
    enchant.Sprite.call(this, 7, 7);
    
    this.shotdist = 0;
    this.owner = owner;
    this.owner.shots ++;
    this.wallbounces = 0;
    this.image = game.assets['shot.png'];
    this.x = x - 3.5;
    this.y = y - 3.5;
    this.frame = 0;
    this.dir = direction;
    this.ray = new geom2d.Ray(this.x + 3.5, this.y + 3.5, this.dir);
    {
      this._rotation = this.dir/Math.PI*180;
      this._dirty = true;
    }
    
    this.moveSpeed = config.shotspeed;
    this.addEventListener('enterframe', function() {
      var hit = hitwall(map, this.ray, this.moveSpeed);
      if(!!hit) {
        this.x += hit[0] * this.ray.dirx;
        this.y += hit[0] * this.ray.diry;
        
        this.dir = hit[1]*2 - this.dir;
        this.ray.setDirection(this.dir);
        
        {
          this._rotation = this.dir/Math.PI*180;
          this._dirty = true;
        }
        
        this.x += (this.moveSpeed - hit[0]) * this.ray.dirx;
        this.y += (this.moveSpeed - hit[0]) * this.ray.diry;
        this.wallbounces ++;
      } else {
        this.x += this.moveSpeed * this.ray.dirx;
        this.y += this.moveSpeed * this.ray.diry;
      }
      this.ray.setPosition(this.x+3.5, this.y+3.5);
      
      this.shotdist += this.moveSpeed;
      if (this.shotdist >= config.shotdist) {
        this.remove();
        return;
      }
      if (this.y > map.height || this.x > map.width || this.x < -this.width || this.y < -this.height) {
        this.remove();
        return;
      }
    });
    stage.addChild(this);
  },
  remove: function() {
    this.owner.shots--;
    /* this should never happen but it does */
    if(this.owner.shots < 0) this.owner.shots = 0
    stage.removeChild(this);
    delete this;
  }
});

/**
 * PlayerShoot (self shooting) class. Created and succeeds Shoot class.
 * PlayerShoot (自弾) クラス。Shootクラスを継承して作成する。
 */
var PlayerShoot = enchant.Class.create(Shoot, {
  initialize: function(owner, x, y, rot) {
    Shoot.call(this, owner, x, y, rot);
    
    this.addEventListener('enterframe', function() {
      for (var i in players) {
        var player = players[i];
        if (player.intersect(this)) {
          if(player === this.owner && this.wallbounces < 1)
            continue;
          player.lossLife(this.owner);
          this.remove();
          return;
        }
      }
    });
  }
});

var hittest = function(map, cx, cy, r) {
  var d = 5;
  var r_sqr = r * r;

  var collisionData = map.collisionData;
  var width = map.width;
  var height = map.height;
  var tileWidth = map._tileWidth;
  var tileHeight = map._tileHeight;
  var mx = cx / tileWidth | 0;
  var my = cy / tileHeight | 0;

  // center
  if (!!collisionData[my] && !!collisionData[my][mx])
    return true;
  if (cx - r < 0 || cx + r > width)
    return true;
  if (cy - r < 0 || cy + r > height)
    return true;
  
  var check = function(x,y,q) {
    if (!!collisionData[my+y] && !!collisionData[my+y][mx+x]) {
      for (var i = 0; i < d; i++) {
        var dx = cx - tileWidth *  (mx+q[0] + q[2]*i/d);
        var dy = cy - tileHeight * (my+q[1] + q[3]*i/d);
        if (dx * dx + dy * dy <= r_sqr)
          return true;
      }
    }
    return false;
  };
  var check_border = function(x,y,q) {
    if (!!collisionData[my+y] && !!collisionData[my+y][mx+x]) {
      var dx = cx - tileWidth *  (mx+q[0]);
      var dy = cy - tileHeight * (my+q[1]);
      if (dx * dx + dy * dy <= r_sqr)
          return true;
    }
    return false;;
  };
  
  if(check(-1, 0,[0,0,0,1])) return true;
  if(check( 0,-1,[0,0,1,0])) return true;
  if(check( 1, 0,[1,0,0,1])) return true;
  if(check( 0, 1,[0,1,1,0])) return true;
  if(check_border(-1,-1,[0,0])) return true;
  if(check_border( 1,-1,[1,0])) return true;
  if(check_border(-1, 1,[0,1])) return true;
  if(check_border( 1, 1,[1,1])) return true;
  
  return false;
};

var hitwall = function(map, ray, speed) {
  var collisionData = map.collisionData;
  var tileWidth = map._tileWidth;
  var tileHeight = map._tileHeight;
  var mx = ray.x / tileWidth | 0;
  var my = ray.y / tileHeight | 0;

  var refection_base;
  var t = Number.POSITIVE_INFINITY;

  var check = function(dx, dy, q, angle){
    if(!!collisionData[my+dy] && !!collisionData[my+dy][mx+dx]) {
      var aabb = new geom2d.AABB();
      aabb.add(tileWidth * (mx + q[0]), tileHeight * (my + q[1]));
      aabb.add(tileWidth * (mx + q[0] + q[2]), tileHeight * (my + q[1] + q[3]));
      // extend the bb to avoid 'glitching' through rounding errors
      aabb.extend(0.001);
      var _t = aabb.hitray(ray);
      if(_t <= speed && _t >= 0 && _t < t) {
        t = _t;
        refection_base = angle;
      }
    }
  };
  
  check(-1,  0 ,[0,0,0,1], Math.PI * 1.5);
  check(+1,  0 ,[1,0,0,1], Math.PI * 0.5);
  check( 0, -1 ,[0,0,1,0], Math.PI);
  check( 0, +1 ,[0,1,1,0], 0);

  check(-1, -1, [0,0,-1,0], Math.PI);
  check(-1, -1, [0,0,0,-1], Math.PI * 0.5);
  check(-1,  1, [0,1,-1,0], 0);
  check(-1,  1, [0,1,0,+1], Math.PI * 0.5);
  check( 1, -1, [1,0, 1,0], Math.PI);
  check( 1, -1, [1,0,0,-1], Math.PI * 1.5);
  check( 1,  1, [1,1, 1,0], 0);
  check( 1,  1, [1,1, 0,1], Math.PI * 1.5);

  if(t === Number.POSITIVE_INFINITY)
    return false;
  return [t,refection_base];
};