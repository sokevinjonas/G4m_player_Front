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
  private readonly DEFAULT_AVATAR = 'assets/icon/profile.jpeg';
  private readonly STORAGE_BASE_URL = environment.apiUrl.replace(
    '/api',
    '/storage'
  );

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

      if (!image.webPath) {
        return null;
      }

      const file = await this.createFileFromUri(image.webPath);

      return {
        file,
        previewUrl: image.webPath,
      };
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      throw error;
    }
  }

  /**
   * Crée un fichier à partir d'une URI
   */
  private async createFileFromUri(uri: string): Promise<File> {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileType = blob.type || 'image/jpeg';
    const extension = this.getFileExtension(fileType);
    const fileName = `avatar.${extension}`;

    const file = new File([blob], fileName, { type: fileType });

    console.log('Image sélectionnée via service:', {
      name: file.name,
      size: file.size,
      type: file.type,
      isFile: file instanceof File,
    });

    return file;
  }

  /**
   * Extrait l'extension du fichier depuis le type MIME
   */
  private getFileExtension(mimeType: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };

    return extensions[mimeType] || mimeType.split('/')[1] || 'jpg';
  }

  /**
   * Convertit une URL d'avatar backend en URL complète pour l'affichage
   */
  getAvatarDisplayUrl(avatarPath: string | null, baseUrl?: string): string {
    if (!avatarPath) {
      return this.DEFAULT_AVATAR;
    }

    if (this.isCompleteUrl(avatarPath)) {
      return this.correctUrlIfNeeded(avatarPath);
    }

    return this.buildFullUrl(avatarPath, baseUrl);
  }

  /**
   * Vérifie si l'URL est complète
   */
  private isCompleteUrl(url: string): boolean {
    return url.startsWith('http');
  }

  /**
   * Corrige l'URL si elle contient localhost
   */
  private correctUrlIfNeeded(avatarPath: string): string {
    console.log('URL avatar complète détectée:', avatarPath);

    if (avatarPath.includes('localhost')) {
      const correctedUrl = avatarPath.replace(
        /http:\/\/localhost(:\d+)?/,
        this.STORAGE_BASE_URL.replace('/storage', '')
      );
      console.log('URL corrigée avec environment:', correctedUrl);
      return correctedUrl;
    }

    return avatarPath;
  }

  /**
   * Construit l'URL complète pour un chemin relatif
   */
  private buildFullUrl(avatarPath: string, baseUrl?: string): string {
    const storageBaseUrl = baseUrl || this.STORAGE_BASE_URL;

    // Si le chemin commence par /storage/, on le retire car il est déjà dans la base URL
    let cleanPath = avatarPath;
    if (avatarPath.startsWith('/storage/')) {
      cleanPath = avatarPath.substring('/storage/'.length);
    } else if (avatarPath.startsWith('/')) {
      cleanPath = avatarPath.substring(1);
    }

    const fullUrl = `${storageBaseUrl}/${cleanPath}`;
    console.log(`URL avatar construite avec environment: ${fullUrl}`);
    return fullUrl;
  }

  /**
   * Génère une URL de prévisualisation pour un fichier
   */
  async generatePreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject('Le fichier doit être une image valide');
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          resolve(result);
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

  /**
   * Valide si un fichier est une image supportée
   */
  isValidImageFile(file: File): boolean {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    return supportedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB max
  }

  /**
   * Compresse une image si elle est trop volumineuse
   */
  async compressImageIfNeeded(
    file: File,
    maxSizeKB: number = 1024
  ): Promise<File> {
    if (file.size <= maxSizeKB * 1024) {
      return file; // Pas besoin de compression
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer la nouvelle taille en gardant le ratio
        const maxDimension = 800;
        let { width, height } = img;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject('Échec de la compression');
            }
          },
          file.type,
          0.8
        ); // Qualité 80%
      };

      img.onerror = () => reject("Erreur lors du chargement de l'image");
      img.src = URL.createObjectURL(file);
    });
  }
}
