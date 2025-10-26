import { Injectable } from '@angular/core';

export interface BrandIcon {
  icon: string;
  color: string;
  backgroundColor?: string; // Para alguns casos especiais
}

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private readonly DEFAULT_ICON: BrandIcon = { 
    icon: 'pi pi-globe', 
    color: '#6B7280' 
  };
  
  // Mapeamento de domínios para ícones e cores das marcas
  private brandIcons: Map<string, BrandIcon> = new Map([
    // Redes Sociais
    ['facebook.com', { icon: 'pi pi-facebook', color: '#1877F2' }],
    ['twitter.com', { icon: 'pi pi-twitter', color: '#1DA1F2' }],
    ['instagram.com', { icon: 'pi pi-instagram', color: '#E4405F' }],
    ['linkedin.com', { icon: 'pi pi-linkedin', color: '#0A66C2' }],
    ['youtube.com', { icon: 'pi pi-youtube', color: '#FF0000' }],
    ['whatsapp.com', { icon: 'pi pi-whatsapp', color: '#25D366' }],
    ['discord.com', { icon: 'pi pi-discord', color: '#5865F2' }],
    ['slack.com', { icon: 'pi pi-slack', color: '#4A154B' }],
    ['reddit.com', { icon: 'pi pi-reddit', color: '#FF4500' }],
    ['tiktok.com', { icon: 'pi pi-video', color: '#000000' }],
    
    // Streaming
    ['netflix.com', { icon: 'pi pi-play', color: '#E50914' }],
    ['spotify.com', { icon: 'pi pi-spotify', color: '#1DB954' }],
    ['twitch.tv', { icon: 'pi pi-twitch', color: '#9146FF' }],
    ['disneyplus.com', { icon: 'pi pi-play', color: '#0063E5' }],
    ['hbo.com', { icon: 'pi pi-play', color: '#000000' }],
    ['primevideo.com', { icon: 'pi pi-play', color: '#00A8E1' }],
    ['deezer.com', { icon: 'pi pi-music', color: '#FEAA2D' }],
    ['applemusic.com', { icon: 'pi pi-apple', color: '#FA243C' }],
    
    // Lojas e E-commerce
    ['amazon.com', { icon: 'pi pi-amazon', color: '#FF9900' }],
    ['amazon.com.br', { icon: 'pi pi-amazon', color: '#FF9900' }],
    ['ebay.com', { icon: 'pi pi-shopping-bag', color: '#E53238' }],
    ['shopify.com', { icon: 'pi pi-shopping-cart', color: '#7AB55C' }],
    ['aliexpress.com', { icon: 'pi pi-shopping-cart', color: '#FF4747' }],
    ['mercadolivre.com', { icon: 'pi pi-shopping-cart', color: '#FFF159' }],
    ['magazineluiza.com', { icon: 'pi pi-shopping-cart', color: '#FF6B00' }],
    ['americanas.com.br', { icon: 'pi pi-shopping-cart', color: '#FF0000' }],
    ['submarino.com.br', { icon: 'pi pi-shopping-cart', color: '#0000FF' }],
    
    // Bancos e Financeiro
    ['itau.com.br', { icon: 'pi pi-money-bill', color: '#FF7200' }],
    ['bancodobrasil.com.br', { icon: 'pi pi-money-bill', color: '#FECE00' }],
    ['santander.com.br', { icon: 'pi pi-money-bill', color: '#EC0000' }],
    ['bradesco.com.br', { icon: 'pi pi-money-bill', color: '#CC092F' }],
    ['nubank.com.br', { icon: 'pi pi-credit-card', color: '#8A05BE' }],
    ['inter.co', { icon: 'pi pi-credit-card', color: '#FF7A00' }],
    ['paypal.com', { icon: 'pi pi-paypal', color: '#003087' }],
    ['picpay.com', { icon: 'pi pi-mobile', color: '#11C76F' }],
    
    // Email e Comunicação
    ['gmail.com', { icon: 'pi pi-envelope', color: '#EA4335' }],
    ['outlook.com', { icon: 'pi pi-envelope', color: '#0078D4' }],
    ['hotmail.com', { icon: 'pi pi-envelope', color: '#0078D4' }],
    ['yahoo.com', { icon: 'pi pi-envelope', color: '#6001D2' }],
    ['icloud.com', { icon: 'pi pi-envelope', color: '#0A7AFF' }],
    ['protonmail.com', { icon: 'pi pi-envelope', color: '#6D4AFF' }],
    
    // Desenvolvimento e Tecnologia
    ['github.com', { icon: 'pi pi-github', color: '#181717' }],
    ['gitlab.com', { icon: 'pi pi-gitlab', color: '#FC6D26' }],
    ['bitbucket.org', { icon: 'pi pi-code', color: '#0052CC' }],
    ['stackoverflow.com', { icon: 'pi pi-question-circle', color: '#F58025' }],
    ['gitlab.com', { icon: 'pi pi-gitlab', color: '#FC6D26' }],
    ['docker.com', { icon: 'pi pi-cog', color: '#2496ED' }],
    ['kubernetes.io', { icon: 'pi pi-cog', color: '#326CE5' }],
    
    // Google Services
    ['google.com', { icon: 'pi pi-google', color: '#4285F4' }],
    ['drive.google.com', { icon: 'pi pi-google', color: '#34A853' }],
    ['docs.google.com', { icon: 'pi pi-google', color: '#4285F4' }],
    ['calendar.google.com', { icon: 'pi pi-google', color: '#EA4335' }],
    ['photos.google.com', { icon: 'pi pi-google', color: '#4285F4' }],
    
    // Microsoft
    ['microsoft.com', { icon: 'pi pi-microsoft', color: '#0078D4' }],
    ['office.com', { icon: 'pi pi-microsoft', color: '#D83B01' }],
    ['live.com', { icon: 'pi pi-microsoft', color: '#0078D4' }],
    ['azure.com', { icon: 'pi pi-cloud', color: '#0078D4' }],
    
    // Apple
    ['apple.com', { icon: 'pi pi-apple', color: '#000000' }],
    ['icloud.com', { icon: 'pi pi-apple', color: '#0A7AFF' }],
    ['appstore.com', { icon: 'pi pi-apple', color: '#000000' }],
    
    // Outros serviços populares
    ['dropbox.com', { icon: 'pi pi-dropbox', color: '#0061FF' }],
    ['notion.so', { icon: 'pi pi-file', color: '#000000' }],
    ['trello.com', { icon: 'pi pi-trello', color: '#0052CC' }],
    ['figma.com', { icon: 'pi pi-palette', color: '#F24E1E' }],
    ['adobe.com', { icon: 'pi pi-adobe', color: '#FF0000' }],
    ['zoom.us', { icon: 'pi pi-video', color: '#2D8CFF' }],
    ['skype.com', { icon: 'pi pi-skype', color: '#00AFF0' }],
    ['telegram.org', { icon: 'pi pi-send', color: '#0088CC' }],
    ['signal.org', { icon: 'pi pi-shield', color: '#3A76F0' }],
    
    // Jogos
    ['steampowered.com', { icon: 'pi pi-desktop', color: '#000000' }],
    ['epicgames.com', { icon: 'pi pi-desktop', color: '#2A2A2A' }],
    ['xbox.com', { icon: 'pi pi-microsoft', color: '#107C10' }],
    ['playstation.com', { icon: 'pi pi-play', color: '#003087' }],
    ['nintendo.com', { icon: 'pi pi-play', color: '#E60012' }],
    
    // Viagens e Transporte
    ['uber.com', { icon: 'pi pi-car', color: '#000000' }],
    ['airbnb.com', { icon: 'pi pi-home', color: '#FF5A5F' }],
    ['booking.com', { icon: 'pi pi-home', color: '#003580' }],
    ['tripadvisor.com', { icon: 'pi pi-compass', color: '#34E0A1' }],
    
    // Educação
    ['coursera.org', { icon: 'pi pi-book', color: '#2A73CC' }],
    ['udemy.com', { icon: 'pi pi-book', color: '#A435F0' }],
    ['khanacademy.org', { icon: 'pi pi-book', color: '#14BF96' }],
    ['edx.org', { icon: 'pi pi-book', color: '#02262B' }],
  ]);

  constructor() {}

  getIconForUrl(url: string): BrandIcon {
    if (!url) return this.DEFAULT_ICON;

    try {
      // Extrair domínio da URL
      const domain = this.extractDomain(url);
      
      // Procurar ícone exato
      const exactIcon = this.brandIcons.get(domain);
      if (exactIcon) return exactIcon;

      // Procurar por partes do domínio (subdomínios)
      for (const [key, icon] of this.brandIcons) {
        if (domain.includes(key)) {
          return icon;
        }
      }

      return this.DEFAULT_ICON;
    } catch {
      return this.DEFAULT_ICON;
    }
  }

  private extractDomain(url: string): string {
    // Adicionar protocolo se não tiver
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const domain = new URL(url).hostname;
    
    // Remover www.
    return domain.replace(/^www\./, '');
  }

  // Método para adicionar ícones customizados dinamicamente
  addCustomIcon(domain: string, icon: BrandIcon): void {
    this.brandIcons.set(domain, icon);
  }

  // Obter todos os domínios mapeados (para debug)
  getMappedDomains(): string[] {
    return Array.from(this.brandIcons.keys());
  }
}