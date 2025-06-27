import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { environment } from 'src/environments/environment';

export interface ImageResult {
  file: File;
  previewUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileSaveOrPreviewService {
  constructor() {}

  /**
   * Sélectionne une image depuis la caméra ou la galerie
   */
  async selectImage(): Promise<ImageResult | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Changer la Photo de Profil',
        promptLabelPhoto: 'Choisir dans la Galerie',
        promptLabelPicture: 'Prendre une Photo',
      });

      if (image.webPath) {
        // Récupérer le fichier depuis l'URI
        const response = await fetch(image.webPath);
        const blob = await response.blob();

        // Créer un File avec le bon type MIME détecté
        const fileType = blob.type || 'image/jpeg';
        const fileName = `avatar.${fileType.split('/')[1] || 'jpg'}`;

        const file = new File([blob], fileName, {
          type: fileType,
        });

        console.log('Image sélectionnée via service:', {
          name: file.name,
          size: file.size,
          type: file.type,
          isFile: file instanceof File,
        });

        return {
          file: file,
          previewUrl: image.webPath,
        };
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      throw error;
    }
  }

  /**
   * Convertit une URL d'avatar backend en URL complète pour l'affichage
   */
  getAvatarDisplayUrl(avatarPath: string | null, baseUrl?: string): string {
    if (!avatarPath) {
      return 'assets/icon/profile.jpeg';
    }

    // Si c'est déjà une URL complète, la retourner telle quelle
    if (avatarPath.startsWith('http')) {
      console.log('URL avatar complète détectée:', avatarPath);

      // Si l'URL contient localhost, la corriger avec l'URL de l'environment
      if (avatarPath.includes('localhost')) {
        const storageBaseUrl = environment.apiUrl.replace('/api', '/storage');
        const correctedUrl = avatarPath.replace(
          /http:\/\/localhost(:\d+)?/,
          storageBaseUrl.replace('/storage', '')
        );
        console.log('URL corrigée avec environment:', correctedUrl);
        return correctedUrl;
      }

      return avatarPath;
    }

    // Si c'est un chemin relatif, construire l'URL complète avec l'environment
    const storageBaseUrl =
      baseUrl || environment.apiUrl.replace('/api', '/storage');
    const fullUrl = `${storageBaseUrl}/${avatarPath}`;
    console.log(`URL avatar construite avec environment: ${fullUrl}`);

    return fullUrl;
  }

  /**
   * Génère une URL de prévisualisation pour un fichier
   */
  generatePreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject("Impossible de générer l'URL de prévisualisation");
        }
      };

      reader.onerror = () => {
        reject('Erreur lors de la lecture du fichier');
      };

      reader.readAsDataURL(file);
    });
  }
}
