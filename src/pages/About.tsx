import React from "react";

const About = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-6">
      <div className="mx-auto mt-10 mb-20 bg-zinc-900/90 text-zinc-100 p-8 rounded-2xl shadow-2xl max-w-2xl w-full font-mono space-y-6 border border-zinc-700">
        <h1 className="text-2xl font-semibold text-cyan-400">🌍 À propos de TRACE</h1>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Pourquoi ce projet ?</strong>
            <br />
            Parce qu’il y a en moi une chose que je n’ai jamais pu faire taire : ce besoin viscéral de <em>comprendre</em>, de <em>connaître</em>, d’<em>apprendre</em>. Mais surtout de transmettre. 
            Non pas transmettre des savoirs bruts, académiques ou désincarnés — transmettre une émotion. Une vibration. Quelque chose qui touche, qui ouvre, qui fait respirer autrement.
          </p>
          <p>
            Depuis toujours, je ressens un émerveillement intense et permanent pour ce qui fut, ce qui est, et ce qui pourrait être. 
            Cet émerveillement est une forme de tendresse infinie envers les choses du monde, les gestes oubliés, les échos du vivant. 
            TRACE en est le vecteur : une passerelle sensible, un fragment offert, une trace parmi d’autres.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-cyan-300 font-semibold text-lg">🌱 Le monde est un livre ouvert</h2>
          <p>
            TRACE n’est pas un cours d’histoire. Ce n’est pas une carte ni un musée.
            <br />
            TRACE est une <em>constellation</em> de trace.
          </p>
          <p>
            Chaque point, chaque lieu, chaque époque est une étincelle — un instant suspendu où quelque chose a eu lieu. 
            Quelque chose de beau, d’étrange, de grave ou de fragile. Ce projet est ma manière de dire <strong>regarde</strong>, <strong>écoute</strong>, <strong>ressens</strong>.
          </p>
          <p>
            Je propose de faire <em>aimer</em>. 
            Parce qu’on ne protège que ce qu’on aime. Et l’amour naît souvent d’un regard, d’un frisson, d’un mot murmuré au bon moment.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-cyan-300 font-semibold text-lg">🎡 Pourquoi un globe ?</h2>
          <p>
            Il y a dans la vue d’un globe quelque chose de fondamentalement émouvant. 
            Surtout quand il s'agit de notre cher Terre, de notre jardin <em>d'Eden</em>.  C’est un vertige doux. 
            Ce mouvement de zoom/dézoom me bouleverse depuis l’enfance. 
          </p>
          <p>
            Un souvenir qui ne me quitte jamais : un coucher de soleil m’a traversé comme un chant mélancolique. 
            Depuis, je n’ai cessé de chercher cette sensation. TRACE est une tentative pour la raviver — pour la partager.
          </p>
          <p>
            TRACE est un <strong>atlas des traces</strong>. Traces de beauté, de souffrance, de mémoire, de futur possible. 
            Chaque article, chaque point est une balise pour ne pas oublier, pour imaginer autrement, pour <em>sentir</em> encore.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-cyan-300 font-semibold text-lg">🌌 À qui s’adresse TRACE ?</h2>
          <p>
            À celles et ceux qui ne veulent pas seulement <em>savoir</em>, mais <strong>ressentir</strong>.<br />
            À celles et ceux qui aiment s’émerveiller, même pour des choses minuscules.<br />
            À ceux qui cherchent un lieu pour rêver en apprenant, pour apprendre en rêvant.<br />
            Aux enfants intérieurs, aux poètes endormis, aux curieux silencieux.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-cyan-300 font-semibold text-lg">✍️ Une dernière chose</h2>
          <p>
            Je ne suis pas un savant. Ni un orateur. Ni un militant.  
            Je suis juste quelqu’un qui a voulu <strong>laisser une trace</strong>.
          </p>
          <p>
            Et si tu es ici, en train de lire ceci, alors… elle existe déjà.
          </p>
          <p className="text-zinc-500 italic">Merci.</p>
        </section>
      </div>
    </div>
  );
};

export default About;
