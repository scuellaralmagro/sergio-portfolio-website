/**
 * Legal / privacy page content — locale-keyed (en/es). Rendered by
 * LegalPage.astro at /privacy, /es/privacy, /legal, /es/legal. Section bodies
 * are HTML strings (paragraphs, lists, links) rendered with set:html so the
 * prose can carry inline emphasis and links. Kept honest and plain — it
 * describes the site's real data flows (Cloudflare, OpenAI, Supabase, Turnstile).
 */
import type { Locale } from '../i18n/utils';

export interface LegalSection {
  heading: string;
  html: string;
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}

export type LegalDocId = 'privacy' | 'legalNotice';

export const legal: Record<LegalDocId, Record<Locale, LegalDoc>> = {
  privacy: {
    en: {
      title: 'Privacy',
      updated: 'Last updated: July 2026',
      intro:
        'This site is my personal portfolio, and it collects as little as possible. This page explains, in plain terms, what is processed, why, and the choices you have.',
      sections: [
        {
          heading: 'Who is responsible',
          html: `<p>The data controller is <strong>Sergio Cuéllar Almagro</strong>, based in Marbella, Spain. For any privacy question or request, email <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>.</p>`,
        },
        {
          heading: 'Analytics',
          html: `<p>I use <strong>Cloudflare Web Analytics</strong>, which is privacy-first and <strong>cookieless</strong>. It reports aggregate, anonymous traffic — page views, referrers, broad location — and does not build a profile of you or follow you across other sites. That is why this site shows no cookie banner.</p>`,
        },
        {
          heading: 'The “Ask my portfolio” chat',
          html: `<p>The chat demo is the only feature that processes personal data in any meaningful way. When you send a message:</p>
<ul>
<li>Your question is sent to <strong>OpenAI</strong> (United States) to generate an answer. Under OpenAI's API terms, this input is <strong>not used to train their models</strong>.</li>
<li>The conversation is logged to a <strong>Supabase</strong> database so I can operate, debug and improve the demo. Each record holds the messages, timestamps, token counts, an approximate <strong>location (country and city)</strong> derived from your IP, and a <strong>salted, truncated hash of your IP address — never the raw IP</strong>.</li>
<li><strong>Cloudflare Turnstile</strong> runs a bot check that processes technical data, including your IP, to keep the endpoint from being abused.</li>
</ul>
<p>Please don't type sensitive personal information into the chat — it is a public demo.</p>`,
        },
        {
          heading: 'Cookies',
          html: `<p>The site sets one <strong>functional cookie</strong>, <code>lang</code>, to remember your language choice. It is not used for tracking or advertising. Turnstile may set a short-lived cookie to run its security check. Because only strictly necessary and functional cookies are used, no consent banner is required.</p>`,
        },
        {
          heading: 'Legal basis',
          html: `<p>Processing rests on my <strong>legitimate interest</strong> in running, securing and improving this site and its demo, in a proportionate and low-impact way.</p>`,
        },
        {
          heading: 'Who the data is shared with',
          html: `<p>I do not sell your data. It is handled only by the providers that make the site work: <strong>Cloudflare</strong> (hosting, analytics, Turnstile), <strong>OpenAI</strong> (chat responses) and <strong>Supabase</strong> (database). Some of these process data in the <strong>United States</strong> under the safeguards their terms provide.</p>`,
        },
        {
          heading: 'How long it is kept',
          html: `<p>Chat logs are kept only as long as needed to run and secure the demo, and are pruned periodically. Analytics is aggregate and retained by Cloudflare on a rolling window. If you would like your chat records removed, just email me.</p>`,
        },
        {
          heading: 'Your rights',
          html: `<p>Under the GDPR you can request <strong>access, rectification, erasure, restriction, objection and portability</strong> of your data. Email <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a> and I will handle it. You also have the right to lodge a complaint with the Spanish Data Protection Agency (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">AEPD</a>).</p>`,
        },
        {
          heading: 'Changes',
          html: `<p>If this notice changes, the date at the top will be updated.</p>`,
        },
      ],
    },
    es: {
      title: 'Privacidad',
      updated: 'Última actualización: julio de 2026',
      intro:
        'Esta web es mi portfolio personal y recopila lo mínimo posible. Esta página explica, en términos claros, qué se procesa, por qué y qué opciones tienes.',
      sections: [
        {
          heading: 'Quién es responsable',
          html: `<p>El responsable del tratamiento es <strong>Sergio Cuéllar Almagro</strong>, con sede en Marbella, España. Para cualquier consulta o solicitud sobre privacidad, escribe a <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>.</p>`,
        },
        {
          heading: 'Analítica',
          html: `<p>Uso <strong>Cloudflare Web Analytics</strong>, que prioriza la privacidad y <strong>no usa cookies</strong>. Ofrece tráfico agregado y anónimo —visitas, referencias, ubicación aproximada— y no crea un perfil tuyo ni te sigue por otras webs. Por eso esta web no muestra ningún banner de cookies.</p>`,
        },
        {
          heading: 'El chat «Pregunta a mi portfolio»',
          html: `<p>La demo del chat es la única función que trata datos personales de forma relevante. Cuando envías un mensaje:</p>
<ul>
<li>Tu pregunta se envía a <strong>OpenAI</strong> (Estados Unidos) para generar una respuesta. Según los términos de la API de OpenAI, esta entrada <strong>no se usa para entrenar sus modelos</strong>.</li>
<li>La conversación se registra en una base de datos de <strong>Supabase</strong> para poder operar, depurar y mejorar la demo. Cada registro guarda los mensajes, marcas de tiempo, recuento de tokens, una <strong>ubicación aproximada (país y ciudad)</strong> derivada de tu IP y un <strong>hash salado y truncado de tu dirección IP — nunca la IP en crudo</strong>.</li>
<li><strong>Cloudflare Turnstile</strong> ejecuta una verificación anti-bot que trata datos técnicos, incluida tu IP, para evitar el abuso del endpoint.</li>
</ul>
<p>Por favor, no escribas información personal sensible en el chat — es una demo pública.</p>`,
        },
        {
          heading: 'Cookies',
          html: `<p>La web usa una única <strong>cookie funcional</strong>, <code>lang</code>, para recordar tu elección de idioma. No se usa para seguimiento ni publicidad. Turnstile puede establecer una cookie de corta duración para su verificación de seguridad. Como solo se usan cookies estrictamente necesarias y funcionales, no se requiere banner de consentimiento.</p>`,
        },
        {
          heading: 'Base jurídica',
          html: `<p>El tratamiento se basa en mi <strong>interés legítimo</strong> en operar, proteger y mejorar esta web y su demo, de forma proporcionada y de bajo impacto.</p>`,
        },
        {
          heading: 'Con quién se comparten los datos',
          html: `<p>No vendo tus datos. Solo los tratan los proveedores que hacen funcionar la web: <strong>Cloudflare</strong> (hosting, analítica, Turnstile), <strong>OpenAI</strong> (respuestas del chat) y <strong>Supabase</strong> (base de datos). Algunos de ellos procesan datos en <strong>Estados Unidos</strong> bajo las garantías que establecen sus términos.</p>`,
        },
        {
          heading: 'Cuánto tiempo se conservan',
          html: `<p>Los registros del chat se conservan solo el tiempo necesario para operar y proteger la demo, y se depuran periódicamente. La analítica es agregada y Cloudflare la conserva en una ventana móvil. Si quieres que elimine tus registros del chat, basta con que me escribas.</p>`,
        },
        {
          heading: 'Tus derechos',
          html: `<p>Conforme al RGPD puedes solicitar <strong>acceso, rectificación, supresión, limitación, oposición y portabilidad</strong> de tus datos. Escribe a <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a> y me encargaré. También tienes derecho a reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">AEPD</a>).</p>`,
        },
        {
          heading: 'Cambios',
          html: `<p>Si esta información cambia, se actualizará la fecha de la parte superior.</p>`,
        },
      ],
    },
  },
  legalNotice: {
    en: {
      title: 'Legal notice',
      updated: 'Last updated: July 2026',
      sections: [
        {
          heading: 'Site owner',
          html: `<p>This website (<a href="https://sergiocuellar.dev">sergiocuellar.dev</a>) is owned and run by <strong>Sergio Cuéllar Almagro</strong>, based in Marbella, Spain. Contact: <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>.</p>`,
        },
        {
          heading: 'Purpose',
          html: `<p>It is a <strong>personal portfolio</strong> — it presents my work, skills and experience. It sells nothing and offers no paid service.</p>`,
        },
        {
          heading: 'Intellectual property',
          html: `<p>The site's text, design and images are mine unless stated otherwise. The source code of the projects shown lives on <a href="https://github.com/scuellaralmagro" target="_blank" rel="noopener noreferrer">GitHub</a> under the licence stated in each repository. Please don't reuse the written content or the design wholesale without asking.</p>`,
        },
        {
          heading: 'External links & liability',
          html: `<p>The site may link to third-party sites I don't control and am not responsible for. I try to keep everything accurate and available, but the site is offered “as is”, without warranties.</p>`,
        },
        {
          heading: 'Governing law',
          html: `<p>This notice is governed by <strong>Spanish law</strong>.</p>`,
        },
      ],
    },
    es: {
      title: 'Aviso legal',
      updated: 'Última actualización: julio de 2026',
      sections: [
        {
          heading: 'Titular del sitio',
          html: `<p>Esta web (<a href="https://sergiocuellar.dev">sergiocuellar.dev</a>) es propiedad y está gestionada por <strong>Sergio Cuéllar Almagro</strong>, con sede en Marbella, España. Contacto: <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>.</p>`,
        },
        {
          heading: 'Finalidad',
          html: `<p>Es un <strong>portfolio personal</strong> — presenta mi trabajo, mis competencias y mi experiencia. No vende nada ni ofrece ningún servicio de pago.</p>`,
        },
        {
          heading: 'Propiedad intelectual',
          html: `<p>El texto, el diseño y las imágenes de la web son míos salvo que se indique lo contrario. El código fuente de los proyectos mostrados está en <a href="https://github.com/scuellaralmagro" target="_blank" rel="noopener noreferrer">GitHub</a> bajo la licencia indicada en cada repositorio. Por favor, no reutilices el contenido escrito ni el diseño en su conjunto sin pedirlo.</p>`,
        },
        {
          heading: 'Enlaces externos y responsabilidad',
          html: `<p>La web puede enlazar a sitios de terceros que no controlo y de los que no soy responsable. Intento mantenerlo todo exacto y disponible, pero la web se ofrece «tal cual», sin garantías.</p>`,
        },
        {
          heading: 'Legislación aplicable',
          html: `<p>Este aviso se rige por la <strong>legislación española</strong>.</p>`,
        },
      ],
    },
  },
};
