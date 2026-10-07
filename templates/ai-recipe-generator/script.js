
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function toast(message){
  const el = $("#toast");
  if(!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>el.classList.remove("show"),2600);
}

function setupNav(){
  const menu = $("#menuBtn");
  const links = $("#navLinks");
  if(menu && links){
    menu.addEventListener("click", ()=>{
      links.style.display = links.style.display === "flex" ? "" : "flex";
      if(links.style.display === "flex"){
        links.style.position="absolute";
        links.style.top="68px";
        links.style.left="10px";
        links.style.right="10px";
        links.style.padding="10px";
        links.style.flexDirection="column";
        links.style.background="rgba(9,12,10,.94)";
        links.style.border="1px solid rgba(255,255,255,.12)";
        links.style.borderRadius="16px";
        links.style.backdropFilter="blur(18px)";
      }
    });
  }
}

function go(path){ window.location.href = path; }

document.addEventListener("DOMContentLoaded", ()=>{
  setupNav();

  $$("[data-go]").forEach(btn=>{
    btn.addEventListener("click",()=>go(btn.dataset.go));
  });

  $$("[data-toast]").forEach(btn=>{
    btn.addEventListener("click",()=>toast(btn.dataset.toast));
  });

  /* My Recipes tabs — All / Favorites / Recent */
  $$('[data-recipe-tab]').forEach(tab=>{
    tab.addEventListener('click',()=>{
      $$('[data-recipe-tab]').forEach(x=>x.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.recipeTab;
      $$('[data-recipe-panel]').forEach(panel=>{
        panel.style.display = panel.dataset.recipePanel === target ? '' : 'none';
      });
    });
  });

  $$("[data-tab]").forEach(tab=>{
    tab.addEventListener("click",()=>{
      $$("[data-tab]").forEach(x=>x.classList.remove("active"));
      tab.classList.add("active");
      const target=tab.dataset.tab;
      $$("[data-tab-panel]").forEach(panel=>{
        panel.style.display = panel.dataset.tabPanel === target ? "" : "none";
      });
    });
  });

  $$("[data-toggle]").forEach(t=>{
    t.addEventListener("click",()=>t.classList.toggle("on"));
  });

  $$("[data-option]").forEach(o=>{
    o.addEventListener("click",()=>{
      const group=o.parentElement;
      $$(".option",group).forEach(x=>x.classList.remove("selected"));
      o.classList.add("selected");
    });
  });

  const edit=$("#editProfile");
  const modal=$("#profileModal");
  const close=$("#closeModal");
  if(edit && modal){
    edit.addEventListener("click",()=>modal.classList.add("show"));
    close?.addEventListener("click",()=>modal.classList.remove("show"));
    modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show")});
    $("#saveProfile")?.addEventListener("click",()=>{
      const name=$("#profileNameInput")?.value.trim() || "Alex Chen";
      const bio=$("#profileBioInput")?.value.trim() || "Exploring food, flavors and new recipes.";
      $("#displayName") && ($("#displayName").textContent=name);
      $("#displayBio") && ($("#displayBio").textContent=bio);
      modal.classList.remove("show");
      toast("Profile updated");
    });
  }

  const fileInput=$("#ingredientPhoto");
  const drop=$("#dropzone");
  const preview=$("#scannerPreview");
  const previewImg=$("#previewImage");
  const scanBtn=$("#scanBtn");
  if(fileInput && drop){
    const handleFile=(file)=>{
      if(!file || !file.type.startsWith("image/")) return;
      const reader=new FileReader();
      reader.onload=e=>{
        previewImg.src=e.target.result;
        preview.classList.add("show");
        drop.style.display="none";
        toast("Photo uploaded");
      };
      reader.readAsDataURL(file);
    };
    fileInput.addEventListener("change",e=>handleFile(e.target.files[0]));
    ["dragenter","dragover"].forEach(evt=>drop.addEventListener(evt,e=>{
      e.preventDefault();drop.classList.add("drag");
    }));
    ["dragleave","drop"].forEach(evt=>drop.addEventListener(evt,e=>{
      e.preventDefault();drop.classList.remove("drag");
    }));
    drop.addEventListener("drop",e=>handleFile(e.dataTransfer.files[0]));
  }
  if(scanBtn){
    scanBtn.addEventListener("click",()=>{
      const detected=$("#detectedIngredients");
      if(detected){
        detected.innerHTML=["Tomato","Spinach","Egg","Garlic","Broccoli"].map(x=>`<span class="chip">✓ ${x}</span>`).join("");
      }
      $("#scanResult")?.classList.add("show");
      toast("Ingredients detected");
    });
  }

  const generate=$("#generateRecipe");
  if(generate){
    generate.addEventListener("click",()=>{
      $("#emptyPreview")?.style.setProperty("display","none");
      $("#generatedRecipe")?.classList.add("show");
      toast("Recipe generated");
      window.scrollTo({top:0,behavior:"smooth"});
    });
  }

  const ingredientInput=$("#ingredientInput");
  const chipWrap=$("#ingredientChips");
  const addIngredient=()=>{
    const value=ingredientInput?.value.trim();
    if(!value) return;
    const chip=document.createElement("span");
    chip.className="chip";
    chip.innerHTML=`${value} <button type="button" style="border:0;background:none;color:inherit" aria-label="remove">×</button>`;
    chip.querySelector("button").addEventListener("click",()=>chip.remove());
    chipWrap?.appendChild(chip);
    ingredientInput.value="";
  };
  $("#addIngredient")?.addEventListener("click",addIngredient);
  ingredientInput?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addIngredient()}});

  $$(".favorite-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      btn.classList.toggle("active");
      btn.textContent=btn.classList.contains("active")?"♥":"♡";
      toast(btn.classList.contains("active")?"Added to favorites":"Removed from favorites");
    });
  });
});

/* =========================================================
   MOTION REFRESH — keeps newly revealed content animated too
   ========================================================= */
document.addEventListener("DOMContentLoaded",()=>{
  const motionTargets = [
    ...document.querySelectorAll(".generated, #scanResult, .modal")
  ];

  const refreshMotion = (el)=>{
    if(!el) return;
    el.classList.remove("motion-refresh");
    void el.offsetWidth;
    el.classList.add("motion-refresh");
  };

  motionTargets.forEach(el=>{
    const observer = new MutationObserver(()=>{
      if(el.classList.contains("show")) refreshMotion(el);
    });
    observer.observe(el,{attributes:true,attributeFilter:["class"]});
  });
});
