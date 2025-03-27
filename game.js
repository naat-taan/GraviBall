let jogador;
let plataformas = [];
let velocidadeJogo = 2;
let pontuacao = 0;
let gameOver = false;
const ESPACAMENTO_PLATAFORMAS = 90;

function setup() {
  createCanvas(400, 500);
  reiniciarJogo();
}

function draw() {
  if (!gameOver) {
    atualizarCena();
    desenharCena();
    verificarFimDeJogo();
  }
}

function reiniciarJogo() {
  jogador = {
    pos: createVector(200, 150),
    vel: createVector(0, 0),
    estaNoChao: false,
    tamanho: 20,
    raio: 10
  };
 
  plataformas = [];
  pontuacao = 0;
  gameOver = false;
  criarPlataforma(height);
}

function atualizarCena() {
  background(135, 210, 240, 80);
  processarMovimentoJogador();
  atualizarPosicaoJogador();
  atualizarPlataformas();
  verificarColisoes();
}

function processarMovimentoJogador() {
  const velocidadeHorizontal = 3.5;
  jogador.vel = 0;
 
  if (keyIsDown(LEFT_ARROW)) jogador.vel = -velocidadeHorizontal;
  if (keyIsDown(RIGHT_ARROW)) jogador.vel = velocidadeHorizontal;
}

function atualizarPosicaoJogador() {
  jogador.pos.add(jogador.vel);
 
  jogador.pos.x = constrain(jogador.pos.x, jogador.raio, width - jogador.raio);
  jogador.pos.y = constrain(jogador.pos.y, jogador.raio, height - jogador.raio);
 
  if (!jogador.estaNoChao) jogador.pos.y += 3;
}

function criarPlataforma(yPos) {
  const larguraBuraco = 40;
  const posicaoBuraco = random(0, width - larguraBuraco);
 
  plataformas.push({ y: yPos, posicaoBuraco, altura: 20 });
}

function atualizarPlataformas() {
  if (plataformas[plataformas.length - 1].y < height - ESPACAMENTO_PLATAFORMAS) {
    criarPlataforma(height);
    pontuacao++;
  }

  plataformas = plataformas.filter(plataforma => {
    plataforma.y -= velocidadeJogo;
    return plataforma.y >= -plataforma.altura;
  });
}

function verificarColisoes() {
  jogador.estaNoChao = false;
 
  for (let plataforma of plataformas) {
    const limiteSuperior = plataforma.y;
    const limiteInferior = plataforma.y + plataforma.altura;
    const baseJogador = jogador.pos.y + jogador.raio;
   
    if (baseJogador > limiteSuperior && baseJogador < limiteInferior) {
      if (jogador.pos.x < plataforma.posicaoBuraco || jogador.pos.x > plataforma.posicaoBuraco + 40) {
        jogador.estaNoChao = true;
        jogador.pos.y = plataforma.y - jogador.raio - velocidadeJogo;
      }
    }
  }
}

function desenharCena() {
  desenharPlataformas();
  desenharJogador();
  mostrarPontuacao();
}

function desenharPlataformas() {
  for (let plataforma of plataformas) {
    fill(40, 130, 80);
    rect(0, plataforma.y, width, plataforma.altura);
   
    stroke(135, 210, 240)
    fill(135, 210, 240);
    rect(plataforma.posicaoBuraco, plataforma.y, 40, plataforma.altura);
  }
}

function desenharJogador() {
  fill(0);
  circle(jogador.pos.x, jogador.pos.y, jogador.tamanho);
}

function mostrarPontuacao() {
  fill(255);
  textSize(24);
  text(`Pontuação: ${pontuacao}`, 10, 30);
}

function verificarFimDeJogo() {
  if (jogador.pos.y - jogador.raio < 0) {
    gameOver = true;
    exibirTelaGameOver();
  }
}

function exibirTelaGameOver() {
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2 - 20);
  text(`Pontuação: ${pontuacao}`, width / 2, height / 2 + 20);
  textSize(18);
  text("Clique para recomeçar", width / 2, height / 2 + 50);
}


function mousePressed() {
  if (gameOver) {
    reiniciarJogo();
  }
}