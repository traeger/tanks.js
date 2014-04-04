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

var reflectx = function(lines) {
  return lines.map(function(s) {return s + s.split("").reverse().join("")})
};

var reflecty = function(lines) {
  return lines.concat(lines.reverse());
};

map_ilja = {width: 48, height: 27};
map_ilja.data = reflectx([
'111111111111111111111111',
'100000000000000000000000',
'100000000000000000000000',
'100111111100010001111110',
'100100000000010000000000',
'100100000000010000000000',
'100100000000010001000000',
'100000111111110001000110',
'100000100000000001000100',
'100100100000000001000100',
'100100100000000001000000',
'100100100011111111000000',
'100100000000000000000100',
'100100000000000000000100',
'100100000000000000111100',
'100000111111111100100000',
'100000000000000100100000',
'100000000000000100000000',
'100100000000000100000111',
'100100000011111100100100',
'100100000000000000100100',
'100111100000000000100100',
'100000100000000000100100',
'100000100111110011100100',
'100000000000000000000000',
'100000000000000000000000',
'111111111111111111111111'
]);