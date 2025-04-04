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
  }

  plataformas = plataformas.filter(plataforma => {
    plataforma.y -= velocidadeJogo;
    return plataforma.y >= -plataforma.altura;
  });
}

function jogadorPassouPeloBuraco(plataforma) {
  const baseJogador = jogador.pos.y + jogador.raio;

  // Verifica se o jogador passou pelo buraco da plataforma
  if (
    baseJogador > plataforma.y + plataforma.altura && // O jogador está abaixo da plataforma
    jogador.pos.x > plataforma.posicaoBuraco && // O jogador está dentro do buraco (limite esquerdo)
    jogador.pos.x < plataforma.posicaoBuraco + 40 // O jogador está dentro do buraco (limite direito)
  ) {
    return true; // O jogador passou pelo buraco
  }

  return false; // O jogador não passou pelo buraco
}

let coresPlataformas = [
  [40, 130, 80], // Verde
  [255, 165, 0], // Laranja
  [0, 0, 255],   // Azul
  [128, 0, 128], // Roxo
  [255, 255, 0]  // Amarelo
];
let corAtualPlataformas = [40, 130, 80]; // Cor inicial das plataformas
let corJogador = [0, 0, 0]; // Cor do jogador (preto)

function mudarCorPlataformas() {
  let novaCor;
  do {
    novaCor = random(coresPlataformas); // Escolhe uma cor aleatória
  } while (novaCor[0] === corJogador[0] && novaCor[1] === corJogador[1] && novaCor[2] === corJogador[2]); // Garante que não seja igual à cor do jogador
  corAtualPlataformas = novaCor; // Atualiza a cor das plataformas
}

function verificarColisoes() {
  jogador.estaNoChao = false;

  for (let plataforma of plataformas) {
    const limiteSuperior = plataforma.y;
    const limiteInferior = plataforma.y + plataforma.altura;
    const baseJogador = jogador.pos.y + jogador.raio;

    // Verifica se o jogador está colidindo com a plataforma
    if (baseJogador > limiteSuperior && baseJogador < limiteInferior) {
      if (jogador.pos.x < plataforma.posicaoBuraco || jogador.pos.x > plataforma.posicaoBuraco + 40) {
        jogador.estaNoChao = true;
        jogador.pos.y = plataforma.y - jogador.raio - velocidadeJogo;
      }
    }

    // Verifica se o jogador passou pelo buraco e incrementa a pontuação
    if (jogadorPassouPeloBuraco(plataforma) && !plataforma.pontoContado) {
      pontuacao++; // Incrementa a pontuação
      plataforma.pontoContado = true; // Marca o ponto como contado

      // Aumenta a velocidade das plataformas e muda a cor a cada 10 pontos
      if (pontuacao > 0 && pontuacao % 10 === 0) {
        velocidadeJogo += 0.5; // Incrementa a velocidade
        mudarCorPlataformas(); // Muda a cor das plataformas
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
    fill(corAtualPlataformas); // Usa a cor atual das plataformas
    rect(0, plataforma.y, width, plataforma.altura);

    stroke(135, 210, 240);
    fill(135, 210, 240); // Cor do buraco
    rect(plataforma.posicaoBuraco, plataforma.y, 40, plataforma.altura);
  }
}

function desenharJogador() {
  fill(0);
  circle(jogador.pos.x, jogador.pos.y, jogador.tamanho);
}

function mostrarPontuacao() {
  fill(255);
  textSize(24); // Tamanho da fonte
  textAlign(LEFT, TOP); // Alinha o texto no canto superior esquerdo
  text(`Pontuação: ${pontuacao}`, 10, 10); // Desenha a pontuação no canto superior esquerdo
}

function verificarFimDeJogo() {
  if (jogador.pos.y - jogador.raio < 0) {
    gameOver = true;
    exibirTelaGameOver();
  }
}

function exibirTelaGameOver() {
  // Fundo semitransparente para o texto
  fill(0, 0, 0, 150); // Cor preta com transparência
  noStroke(); // Remove a borda do retângulo
  rectMode(CENTER); // Define o modo de desenho do retângulo como centralizado
  rect(width / 2, height / 2, 300, 150); // Desenha o retângulo no centro do canvas

  // Texto de "Game Over"
  fill(255, 0, 100); // Cor do texto (vermelho)
  stroke(255, 255, 255, 30); // Borda do texto (vermelho)
  textSize(30);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2 - 30);

  // Texto da pontuação
  textSize(24);
  text(`Pontuação: ${pontuacao}`, width / 2, height / 2);

  // Texto de instrução para reiniciar
  textSize(18);
  text("Clique para recomeçar", width / 2, height / 2 + 40);
}


function mousePressed() {
  if (gameOver) {
    reiniciarJogo();
  }
}