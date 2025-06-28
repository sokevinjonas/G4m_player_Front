import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aides',
  templateUrl: './aides.page.html',
  styleUrls: ['./aides.page.scss'],
  standalone: false,
})
export class AidesPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  openWhatsAppCommunity() {
    // Remplacez par le lien de votre communauté WhatsApp
    const whatsappCommunityLink =
      'https://chat.whatsapp.com/B5dsn3ZhOiXGy5ornLBfOc';
    window.open(whatsappCommunityLink, '_blank');
  }

  openWhatsAppAdmin1() {
    // Remplacez par le numéro WhatsApp de l'admin 1
    const admin1Number = '+22652645634'; // Remplacez par le vrai numéro
    const whatsappLink = `https://wa.me/${admin1Number.replace(
      '+',
      ''
    )}?text=Bonjour, j'ai besoin d'aide avec G4M Player`;
    window.open(whatsappLink, '_blank');
  }

  openWhatsAppAdmin2() {
    // Remplacez par le numéro WhatsApp de l'admin 2
    const admin2Number = '+22652645634'; // Remplacez par le vrai numéro
    const whatsappLink = `https://wa.me/${admin2Number.replace(
      '+',
      ''
    )}?text=Bonjour, j'ai une question sur les tournois`;
    window.open(whatsappLink, '_blank');
  }

  openFacebookPage() {
    // Remplacez par l'URL de votre page Facebook
    const facebookPageUrl = 'https://www.facebook.com/g4meproafrica'; // Remplacez par la vraie URL
    window.open(facebookPageUrl, '_blank');
  }
}
