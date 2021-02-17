let grid=[];
let tetrimino=[];
let ditchInterval = false;
let cur=-1,score=0,timer=900;
let loss=false,limit=1;


document.addEventListener("DOMContentLoaded", function(){
    for(let i=0;i<200;i++){
        document.getElementById("grid").innerHTML += `<div class="box" id="${i}"></div>`;
    }
    for(let i=0;i<20;i++){
        grid.push([]);
        for(let j=0;j<10;j++){
            grid[i].push(0);
        }
    }
    gen_rand();
});
var dimensions = { 
    0:[ [[0,0],[-1,-1],[-2,-2],[-3,-3]] , [[0,0],[1,1],[2,2],[3,3]] ],
    1:[ [[0,1],[-1,2],[0,0],[1,-1]] , [[0,-1],[0,-1],[-1,1],[-1,1]] , [[0,1],[1,0],[2,-1],[1,-2]] ,[[0,-1],[0,-1],[-1,0],[-1,2]] ],
    2:[ [[0,-1],[0,1],[1,0],[1,0]] , [[0,-1],[-1,0],[-2,1],[-1,-2]],[[0,0],[0,0],[1,-1],[1,1]] , [[0,2],[1,-1],[0,0],[-1,1]] ],
    4: [ [[0,0],[1,-1],[0,2],[1,1]] , [[0,0],[-1,1],[0,-2],[-1,-1]] ],
    5: [ [[0,0],[0,1],[0,1],[1,-1]] , [[1,-1],[0,0],[0,0],[0,0]] , [[-1,1],[0,-1],[0,-1],[0,0]], [[0,0],[0,0],[0,0],[-1,1]]],
    6: [ [[0,2],[1,0],[0,1],[1,-1]] , [[0,-2],[-1,0],[0,-1],[-1,1]] ]

};
var current = [0,0,0,0,0,0,0];

var gen_rand = () => {
    if(loss)
        return;
    if(cur!=-1){
        check_line();
    }
    current=[0,0,0,0,0,0,0];
    cur = Math.floor(Math.random()*7);
    if(cur==0){
        tetrimino=[[0,3],[0,4],[0,5],[0,6]];
    }
    else if(cur==1){
        tetrimino=[[0,3],[1,3],[1,4],[1,5]];
    }
    else if(cur==2){
        tetrimino=[[0,5],[1,3],[1,4],[1,5]];
    }
    else if(cur==3){
        tetrimino=[[0,3],[0,4],[1,3],[1,4]];
    }
    else if(cur==4){
        tetrimino=[[0,4],[0,5],[1,3],[1,4]];
    }
    else if(cur==5){
        tetrimino=[[0,4],[1,3],[1,4],[1,5]];
    }
    else{
        tetrimino=[[0,3],[0,4],[1,4],[1,5]];
    }
    for(let i=0;i<4;i++){
        let [a,b]=tetrimino[i];
        if(grid[a][b]==2){
            loss=true;
            return;
        }
    }
    turn_color(tetrimino);
};

const turn_black = (t) => {
    if(loss)
        return;
    for(let i=0;i<t.length;i++){
        let [a,b]=t[i];
        grid[a][b] = 0;
        document.getElementById(`${a*10+b}`).style.backgroundColor="black";
    }
}

const turn_color = (t) => {
    if(loss)
        return;
    //console.log(t);
    for(let i=0;i<t.length;i++){
        let [a,b]=t[i];
        grid[a][b] = 1;
        document.getElementById(`${a*10+b}`).style.backgroundColor="lightblue";
    }
}

var get_tetrimino_down = () => {
    if(loss)
        return;
    for(const [a, b] of tetrimino) {
        if(a+1>=20 || grid[a+1][b]==2){
            for(const [x, y] of tetrimino){
                grid[x][y] = 2;
            }
            gen_rand();
            turn_color(tetrimino);
            return;
        }
    }

    turn_black(tetrimino);
    for(let i=0;i<tetrimino.length;i++) ++tetrimino[i][0];
    turn_color(tetrimino);
}

var move = (x) =>{
    if(loss)
        return;
    for(const [a, b] of tetrimino){
        if(x==1) {
            if(b+1>=10 || grid[a][b+1]==2){
                return;
            }
        }
        else {
            if(b-1<0 || grid[a][b-1]==2){
                return;
            }
        }
    }
    turn_black(tetrimino);
    for(let i=0;i<tetrimino.length;i++) tetrimino[i][1]+=x;
    turn_color(tetrimino);
}

window.setInterval(() => {
    if(loss)
        return;
    if(ditchInterval) return;
    get_tetrimino_down();
}, timer);

var change_shape = () =>{
    if(loss)
        return;
    current[cur] %= dimensions[cur].length;
    let arr = dimensions[cur][current[cur]];
   // console.log(cur, current[cur], tetrimino);
    current[cur]++;
    let new_tetrimino = JSON.parse(JSON.stringify(tetrimino));
    for(let i=0;i<arr.length;i++){
        let [a,b] = arr[i];
        new_tetrimino[i][0]+=a;
        new_tetrimino[i][1]+=b;
        let [x,y]=new_tetrimino[i];
        if(x<0 || x>=20 || y<0 || y>=10 || grid[x][y]==2){
            current[cur]--;
            return;
        }
    }
    turn_black(tetrimino);
    turn_color(new_tetrimino);
    tetrimino = JSON.parse(JSON.stringify(new_tetrimino));
}

document.addEventListener("keydown", (e) => {
    if(loss)
        return;
    const k = e.key;
    //if(ditchKeypress) return;
    if(k=="ArrowUp"){
        if(cur==3)
            return;
        change_shape();
        ditchInterval = true;
        setTimeout(() => {ditchInterval = false}, 50);
    }
    else if(k=="ArrowDown"){
        get_tetrimino_down();
        ditchInterval = true;
        setTimeout(() => {ditchInterval = false}, 50);
    }
    else if(k=="ArrowLeft"){
        move(-1);
        ditchInterval = true;
        setTimeout(() => {ditchInterval = false}, 50);
    }
    else if(k =="ArrowRight"){
        move(1);
        ditchInterval = true;
        setTimeout(() => {ditchInterval = false}, 50);
    }
})

var check_line = () =>{
   // console.log(grid);
    if(loss)
        return;
    let count=0;
    for(let i=19;i>=0;i--){
        let is_line=true;
        for(let j=0;j<10;j++){
            if(grid[i][j]==0){
                is_line=false;
                break;
            }
        }
        if(is_line){
            count++;
            grid.splice(i,1);
            grid.splice(0,0,[0,0,0,0,0,0,0,0,0,0]);
            ++i;
        }
    }
    if(count==0){
        return;
    }
    score += count*count;
    document.getElementById("score").innerHTML = `Score : ${score}`;
    for(let i=0;i<20;i++){
        for(let j=0;j<10;j++){
            if(grid[i][j]==0){
                turn_black([[i,j]]);
            }
            else{
                turn_color([[i,j]]);
                grid[i][j]=2;
            }
        }
    }
  /*  let inter=setInterval(get_tetrimino_down(),timer);
    if(score>=limit && timer>100){
        timer-=500;
        limit+=1;
        clearInterval(inter);
        setInterval(get_tetrimino_down(),timer );
    }*/
}

var reset = () =>{
    grid=[];
    tetrimino=[];
    ditchInterval = false;
    cur=-1;
    score=0;
    loss=false;
    current = [0,0,0,0,0,0,0];

    document.getElementById('score').innerHTML = "Score : 0";

    for(let i=0;i<200;i++){
        document.getElementById(`${i}`).style.backgroundColor ="black";
    }

    for(let i=0;i<20;i++){
        grid.push([]);
        for(let j=0;j<10;j++){
            grid[i].push(0);
        }
    }
    gen_rand();
}