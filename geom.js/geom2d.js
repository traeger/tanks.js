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

geom2d = new function() { lib = this;
	/**
	 * s s first point of the straight line
	 * t second point of the straight line
	 * a point for which we want to calculate the orientation
	 */
	lib.strongleft = function(sx, sy, tx, ty, ax, ay) {
		return orientation(sx, sy, tx, ty, ax, ay) > 0;
	};
	lib.strongright = function(sx, sy, tx, ty, ax, ay) {
		return orientation(sx, sy, tx, ty, ax, ay) < 0;
	};
	lib.left = function(sx, sy, tx, ty, ax, ay) {
		return orientation(sx, sy, tx, ty, ax, ay) >= 0;
	};
	lib.right = function(sx, sy, tx, ty, ax, ay) {
		return orientation(sx, sy, tx, ty, ax, ay) <= 0;
	};
	lib.on = function(sx, sy, tx, ty, ax, ay) {
		return orientation(sx, sy, tx, ty, ax, ay) === 0;
	};
	/**
	 * Orientation of the point.
	 * <pre>
	 * if > 0  : x left of the straight line;
   * if < 0  : x right of the straight line;
	 * if == 0 : x on the straight line;
	 * </pre>
	 * s first point of the straight line
	 * t second point of the straight line
	 * a point for which we want to calculate the orientation
	 * return orientation of the point
	 */
	lib.orientation = function(sx, sy, tx, ty, ax, ay) {
		// p = t - s
		// if (p - a) * n > 0  : x left of the straight line;
		// if (p - a) * n < 0  : x right of the straight line;
		// if (p - a) * n == 0 : x on the straight line;
		
		return (ay - sy) * (tx - sx) - (ax - sx) * (ty - sy);
	};
  
  lib.Ray = function(x, y, direction) {
    this.setPosition(x,y);
    this.setDirection(direction);
  };
  lib.Ray.prototype.setPosition = function(x,y) {
    this.x = x;
    this.y = y;
  };
  lib.Ray.prototype.setDirection = function(direction) {
    this.direction = direction;
    this.dirx = Math.cos(direction);
    this.diry = Math.sin(direction);
  };
  lib.AABB = function() {
    this.x1 = this.y1 = Number.POSITIVE_INFINITY;
    this.x2 = this.y2 = Number.NEGATIVE_INFINITY;
  };
  lib.AABB.prototype.extend = function(eps) {
    this.x1 -= eps;
    this.x2 += eps;
    this.y1 -= eps;
    this.y2 += eps;
  };
  lib.AABB.prototype.add = function(x, y) {
    var min = Math.min; 
    var max = Math.max;
    this.x1 = min(this.x1, x);
    this.x2 = max(this.x2, x);
    this.y1 = min(this.y1, y);
    this.y2 = max(this.y2, y);
  };
  /* http://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms */
  lib.AABB.prototype.hitray = function(ray) {
    // ray.dirx/ray.diry is unit direction vector of ray
    var dirfracx = 1.0 / ray.dirx;
    var dirfracy = 1.0 / ray.diry;
    // x1/y1 is the corner of AABB with minimal coordinates - left bottom, 
    // x1/y2 is maximal corner
    var t1 = (this.x1 - ray.x)*dirfracx;
    var t2 = (this.x2 - ray.x)*dirfracx;
    var t3 = (this.y1 - ray.y)*dirfracy;
    var t4 = (this.y2 - ray.y)*dirfracy;

    var min = Math.min;
    var max = Math.max;
    var tmin = max(min(t1, t2), min(t3, t4));
    var tmax = min(max(t1, t2), max(t3, t4));

    // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
    if (tmax < 0) {
        return -1;
    }
    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax) {
        return -1;
    }
    return tmin;
  };
};
