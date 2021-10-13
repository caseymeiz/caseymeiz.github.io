// in spired by https://www.redblobgames.com/grids/hexagons/#neighbors



class HexCoor {
    constructor(p,q,r) {
        this.p = p
        this.q = q
        this.r = r
    }

    scale(direction, radius) {
        let coor = new HexCoor(this.p, this.q , this.r)
        for (let i = 0; i < radius; i++) {
            coor = coor.neighbor(direction)
        }
        return coor
    }

    neighbor(direction) {
        let d = directions[direction]
        return new HexCoor(this.p + d.p, this.q + d.q, this.r + d.r)
    }

    ring(radius) {
        let result = []
        let coor = this.scale(4, radius)
        if (radius === 0) {
            return [coor.scale(0,0)]
        }
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                coor = coor.neighbor(i)
                result.push(coor)
            }
        }
        return result
    }

    spiral(radius) {
        let result = []
        for (let i = 0; i < radius+1; i++) {
            result = result.concat(this.ring(i))
        }
        return result
    }

    to_pixel(size) {
        let q = this.q
        let r = this.r

        let x = size * (3/2) * q
        let y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r)
        return {"x": x, "y": y}

    }

}
directions = [
    new HexCoor(+1, -1, 0), new HexCoor(+1, 0, -1), new HexCoor(0, +1, -1), 
    new HexCoor(-1, +1, 0), new HexCoor(-1, 0, +1), new HexCoor(0, -1, +1), 
]





