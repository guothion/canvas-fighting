
export const windowToCanvas = function(e:MouseEvent,rect:any) {
    const ex = e.clientX - rect.left;
    const ey = e.clientY - rect.top;
    return {ex,ey};
}