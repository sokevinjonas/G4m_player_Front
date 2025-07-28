import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: false,
})
export class OnboardingPage implements OnInit {
  currentStep = 0;
  totalSteps = 3;

  onboardingSteps = [
    {
      title: 'Bienvenue sur G4ME Pro Africa',
      subtitle: 'La plateforme gaming #1 en Afrique',
      description:
        'Rejoignez des milliers de gamers passionnés à travers tout le continent africain',
      icon: 'game-controller',
      color: 'primary',
    },
    {
      title: 'Compétitions épiques',
      subtitle: 'Tournois et défis exclusifs',
      description:
        'Participez à des tournois officiels, gagnez des prix et gravissez les classements',
      icon: 'trophy',
      color: 'secondary',
    },
    {
      title: 'Communauté unie',
      subtitle: 'Connectez-vous avec des pros',
      description:
        'Créez votre équipe, défiez vos amis et forgez des alliances durables',
      icon: 'people',
      color: 'tertiary',
    },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  skip() {
    this.goToAuth();
  }

  getStarted() {
    this.goToAuth();
  }

  private goToAuth() {
    localStorage.setItem('onboardingCompleted', 'true');
    this.router.navigate(['/auth-choice']);
  }

  async onConnect() {
    this.router.navigate(['/login']);
  }

  async onCreateAccount() {
    this.router.navigate(['/register']);
  }

  async onDashboardAccess() {
    localStorage.setItem('firstLaunch', 'true');
    localStorage.setItem('onboardingCompleted', 'true');
    this.router.navigate(['/tabs/home']);
  }
}
