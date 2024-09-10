
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

export function getTwoPointDistance(x:number,y:number,ex:number,ey:number) :number {
    const xalias = Math.pow((ex-x),2);
    const yalias = Math.pow((ey-y),2);
    return Math.sqrt(xalias+yalias);
}

export function average(x:number,y:number):number {
    return (x+y)/2;
}