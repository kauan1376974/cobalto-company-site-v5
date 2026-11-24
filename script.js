// Menu mobile
const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Fechar menu":"Abrir menu")});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}));
document.querySelector("#year").textContent=new Date().getFullYear();

// Entrada suave das seções
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

// Alternância entre notebook e celular + rotação 3D por mouse/toque.
const demoStage=document.querySelector("#demo-stage");
const demoDevice=document.querySelector("#demo-device");
const deviceButtons=document.querySelectorAll(".device-button");
const resetDevice=document.querySelector("#reset-device");
let deviceRotX=2,deviceRotY=-5,dragging=false,lastPointerX=0,lastPointerY=0;
function applyDeviceRotation(){
  const mobile=demoStage.classList.contains("mobile-mode");
  demoDevice.style.setProperty("--tilt-x",`${deviceRotX}deg`);
  demoDevice.style.setProperty("--tilt-y",`${deviceRotY+(mobile?-3:0)}deg`);
}
function resetDeviceRotation(){deviceRotX=2;deviceRotY=-5;applyDeviceRotation()}
deviceButtons.forEach(button=>button.addEventListener("click",()=>{
  const mobile=button.dataset.device==="mobile";
  demoStage.classList.toggle("mobile-mode",mobile);
  deviceButtons.forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active))});
  applyDeviceRotation();
}));
demoDevice.addEventListener("pointerdown",event=>{
  if(event.target.closest("button,a"))return;
  dragging=true;lastPointerX=event.clientX;lastPointerY=event.clientY;
  demoDevice.classList.add("is-dragging");
  demoDevice.setPointerCapture?.(event.pointerId);
});
demoDevice.addEventListener("pointermove",event=>{
  if(!dragging)return;
  const dx=event.clientX-lastPointerX,dy=event.clientY-lastPointerY;
  lastPointerX=event.clientX;lastPointerY=event.clientY;
  deviceRotY=deviceRotY+dx*.42;
  deviceRotX=Math.max(-18,Math.min(24,deviceRotX-dy*.28));
  applyDeviceRotation();
});
function stopDeviceDrag(){dragging=false;demoDevice.classList.remove("is-dragging")}
demoDevice.addEventListener("pointerup",stopDeviceDrag);
demoDevice.addEventListener("pointercancel",stopDeviceDrag);
demoDevice.addEventListener("lostpointercapture",stopDeviceDrag);
resetDevice?.addEventListener("click",resetDeviceRotation);
demoDevice.addEventListener("keydown",event=>{
  if(event.key==="ArrowLeft"){deviceRotY-=5;applyDeviceRotation()}
  if(event.key==="ArrowRight"){deviceRotY+=5;applyDeviceRotation()}
  if(event.key==="ArrowUp"){deviceRotX+=3;applyDeviceRotation()}
  if(event.key==="ArrowDown"){deviceRotX-=3;applyDeviceRotation()}
});
applyDeviceRotation();

// Formulário abre o aplicativo de e-mail; não armazena dados.
const contactForm=document.querySelector("#contact-form");
contactForm.addEventListener("submit",event=>{
  event.preventDefault();
  const data=new FormData(contactForm);
  const name=data.get("name").trim(),email=data.get("email").trim(),service=data.get("service"),message=data.get("message").trim();
  const subject=encodeURIComponent(`Solicitação de orçamento - ${service}`);
  const body=encodeURIComponent(`Olá, Cobalto Company!\\n\\nNome: ${name}\\nE-mail: ${email}\\nServiço: ${service}\\n\\nSobre o projeto:\\n${message||"Não informado"}`);
  window.location.href=`mailto:cobaltocompany.contato@gmail.com?subject=${subject}&body=${body}`;
});
document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{const select=document.querySelector('select[name="service"]');const option=[...select.options].find(item=>item.text===link.dataset.service);if(option)select.value=option.value}));

// Símbolo C 3D da Cobalto. O elemento CSS permanece como fallback se WebGL/CDN falhar.
(function initHero3D(){
  const canvas=document.querySelector("#hero-canvas");
  const stage=document.querySelector("#hero-stage");
  if(!canvas||!stage)return;
  if(!window.THREE){canvas.classList.add("no-three");return}
  try{
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(34,1,.1,100);
    camera.position.set(0,0,8.5);
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.setClearColor(0x000000,0);
    if("outputColorSpace" in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;

    // Forma vetorial extrudada: um C espesso, aberto à direita.
    const shape=new THREE.Shape();
    const outer=1.42,inner=.91,gap=.62;
    shape.absarc(0,0,outer,gap,Math.PI*2-gap,false);
    shape.lineTo(inner*Math.cos(Math.PI*2-gap),inner*Math.sin(Math.PI*2-gap));
    shape.absarc(0,0,inner,Math.PI*2-gap,gap,true);
    shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{
      depth:.34,bevelEnabled:true,bevelSegments:5,steps:1,
      bevelSize:.075,bevelThickness:.075,curveSegments:72
    });
    geometry.center();
    const material=new THREE.MeshPhysicalMaterial({
      color:0x1675ff,metalness:.78,roughness:.2,clearcoat:1,
      clearcoatRoughness:.1,emissive:0x062b77,emissiveIntensity:.38
    });
    const mark=new THREE.Mesh(geometry,material);
    mark.rotation.z=-.08;
    const group=new THREE.Group();group.add(mark);scene.add(group);

    const edge=new THREE.Mesh(
      new THREE.TorusGeometry(1.72,.012,8,160),
      new THREE.MeshStandardMaterial({color:0x65c5ff,metalness:.8,roughness:.2,emissive:0x0754cb,emissiveIntensity:.45})
    );
    edge.rotation.x=1.05;edge.rotation.y=.25;group.add(edge);
    const edge2=new THREE.Mesh(
      new THREE.TorusGeometry(1.95,.008,8,160),
      new THREE.MeshStandardMaterial({color:0x398eff,metalness:.75,roughness:.25,emissive:0x073caa,emissiveIntensity:.35})
    );
    edge2.rotation.x=.35;edge2.rotation.y=1.1;group.add(edge2);

    scene.add(new THREE.AmbientLight(0x9ccaff,1.35));
    const key=new THREE.PointLight(0x3b8cff,75,22);key.position.set(3,3,4);scene.add(key);
    const rim=new THREE.PointLight(0x2bd0ff,55,20);rim.position.set(-4,-2,-2);scene.add(rim);
    const particlesGeometry=new THREE.BufferGeometry(),positions=[];
    for(let i=0;i<140;i++)positions.push((Math.random()-.5)*8,(Math.random()-.5)*5,(Math.random()-.5)*4);
    particlesGeometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
    const particles=new THREE.Points(particlesGeometry,new THREE.PointsMaterial({color:0x82caff,size:.02,transparent:true,opacity:.65}));
    scene.add(particles);

    let targetX=0,targetY=0;
    const onMove=e=>{
      const rect=canvas.getBoundingClientRect();
      targetY=((e.clientX-rect.left)/rect.width-.5)*.42;
      targetX=((e.clientY-rect.top)/rect.height-.5)*.3;
    };
    canvas.addEventListener("pointermove",onMove);
    canvas.addEventListener("pointerleave",()=>{targetX=0;targetY=0});
    function resize(){
      const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height);
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    }
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
    stage.classList.add("has-webgl");
    let frame=0,raf=0;
    function animate(){
      if(!reduced){
        frame+=.006;
        group.rotation.y+=(targetY-group.rotation.y)*.025;
        group.rotation.x+=(targetX-group.rotation.x)*.025;
        group.rotation.y+=.0022;
        group.rotation.z=Math.sin(frame*.55)*.035;
        particles.rotation.y+=.0003;
        group.position.y=Math.sin(frame)*.045;
      }
      renderer.render(scene,camera);
      if(!reduced)raf=requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener("resize",resize);
  }catch(error){
    canvas.classList.add("no-three");
    stage.classList.remove("has-webgl");
    console.warn("Cobalto 3D fallback ativado:",error);
  }
})();


// WhatsApp flutuante: configure somente o número oficial da empresa (DDI + DDD + número).
// Exemplo de formato: 55 + DDD + número, sem +, espaços ou traços.
const COBALTO_WHATSAPP_NUMBER = "5511932839562"; // preencher quando o chip empresarial estiver ativo
const whatsappFloat = document.querySelector("#whatsapp-float");
whatsappFloat?.addEventListener("click", event => {
  if (!COBALTO_WHATSAPP_NUMBER) {
    event.preventDefault();
    alert("O WhatsApp comercial da Cobalto ainda está sendo configurado. Em breve este botão abrirá nossa conversa oficial. Por enquanto, use o formulário ou o e-mail de contato.");
    return;
  }
  event.preventDefault();
  const text = encodeURIComponent("Olá! Conheci a Cobalto Company pelo site e gostaria de conversar sobre um projeto.");
  window.open(`https://wa.me/${COBALTO_WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
});

// Chat de demonstração: respostas roteirizadas, sem API, armazenamento ou envio externo.
const chatWidget = document.querySelector("#chat-widget");
const chatMessages = document.querySelector("#chat-messages");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatQuick = document.querySelector("#chat-quick");
function openCobaltoDemoChat(){
  chatWidget?.classList.add("open");
  chatWidget?.setAttribute("aria-hidden","false");
  chatInput?.focus();
}
function closeCobaltoDemoChat(){
  chatWidget?.classList.remove("open");
  chatWidget?.setAttribute("aria-hidden","true");
}
document.querySelectorAll(".assistant-open,.portfolio-chat-open").forEach(button=>button.addEventListener("click",openCobaltoDemoChat));
document.querySelector(".chat-close")?.addEventListener("click",closeCobaltoDemoChat);
function addDemoBubble(message,role){
  const bubble=document.createElement("div");
  bubble.className=`chat-bubble ${role}`;
  bubble.textContent=message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
function demoAssistantReply(message){
  const m=message.toLowerCase();
  if(m.includes("site")||m.includes("web")||m.includes("página")){
    return "Criamos sites profissionais e responsivos, desde páginas de apresentação até experiências 3D. Para entender seu projeto, podemos conversar pelo formulário de contato.";
  }
  if(m.includes("ia")||m.includes("intelig")||m.includes("chatbot")||m.includes("assistente")){
    return "Podemos desenvolver agentes de IA para responder dúvidas, qualificar contatos e apoiar o atendimento. Cada solução é planejada conforme as necessidades e integrações do negócio.";
  }
  if(m.includes("automat")||m.includes("processo")||m.includes("integra")){
    return "As automações conectam ferramentas e ajudam a reduzir tarefas repetitivas. Podemos mapear seu processo e avaliar o que faz sentido automatizar.";
  }
  if(m.includes("preço")||m.includes("valor")||m.includes("orçamento")){
    return "O investimento depende do escopo, das funcionalidades e das integrações. Conte um pouco sobre o que precisa no formulário de contato para avaliarmos seu projeto.";
  }
  if(m.includes("contato")||m.includes("falar")||m.includes("humano")){
    return "Claro! Use o formulário desta página ou escreva para cobaltocompany.contato@gmail.com. Assim a equipe poderá entender melhor sua necessidade.";
  }
  return "Posso apresentar nossos sites, agentes de inteligência artificial e automações. Qual dessas soluções você gostaria de conhecer?";
}
function sendDemoMessage(message){
  const clean=message.trim();
  if(!clean)return;
  addDemoBubble(clean,"user");
  chatInput.value="";
  window.setTimeout(()=>addDemoBubble(demoAssistantReply(clean),"bot"),350);
}
chatForm?.addEventListener("submit",event=>{
  event.preventDefault();
  sendDemoMessage(chatInput.value);
});
chatQuick?.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>sendDemoMessage(button.dataset.chat)));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCobaltoDemoChat()});


// Feedback claro para o formulário: o envio ainda é feito pelo cliente de e-mail.
const contactFormStatus=document.querySelector("#form-status");
contactForm?.addEventListener("submit",()=>{
  if(contactFormStatus){
    contactFormStatus.textContent="Solicitação preparada. Se o aplicativo de e-mail não abrir, escreva para cobaltocompany.contato@gmail.com.";
  }
});
