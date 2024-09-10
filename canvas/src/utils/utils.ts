
export const windowToCanvas = function(e:MouseEvent,rect:any) {
    const ex = e.clientX - rect.left;
    const ey = e.clientY - rect.top;
    return {ex,ey};
}

export function degToRad(degrees:number):number {
	return degrees * (Math.PI / 180)
}

export function radToDeg(radians:number):number {
	return radians * (180 / Math.PI)
}