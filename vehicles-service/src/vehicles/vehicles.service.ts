import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { VehiclePosition } from './entities/vehicle-position.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { CreatePositionInput } from './dto/create-position.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { UpdateVehicleStatusInput } from './dto/update-vehicle-status.input';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,

    @InjectRepository(VehiclePosition)
    private positionRepository: Repository<VehiclePosition>,
  ) {}

  // 1. Ajouter un véhicule
  async createVehicle(
    createVehicleInput: CreateVehicleInput,
  ): Promise<Vehicule> {
    // Vérifier si l'immatriculation existe déjà
    const existing = await this.vehiculeRepository.findOne({
      where: { immatriculation: createVehicleInput.immatriculation },
    });
    if (existing) {
      throw new ConflictException(
        'Un véhicule avec cette immatriculation existe déjà',
      );
    }

    const newVehicle = this.vehiculeRepository.create(createVehicleInput);
    return this.vehiculeRepository.save(newVehicle);
  }

  // 2. Consulter la liste des véhicules
  async findAllVehicles(): Promise<Vehicule[]> {
    return this.vehiculeRepository.find();
  }

  // 3. Consulter le détail d'un véhicule (avec son historique de déplacements)
  async findOneVehicle(id: number): Promise<Vehicule> {
    const vehicle = await this.vehiculeRepository.findOne({
      where: { id },
      relations: { positions: true }, // Magique : TypeORM va faire la jointure (JOIN) automatiquement !
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${id} introuvable`);
    }
    return vehicle;
  }

  // 4. Enregistrer une position GPS
  async addPosition(
    createPositionInput: CreatePositionInput,
  ): Promise<VehiclePosition> {
    // On vérifie d'abord que le véhicule existe
    const vehicle = await this.findOneVehicle(createPositionInput.vehicleId);

    const newPosition = this.positionRepository.create({
      latitude: createPositionInput.latitude,
      longitude: createPositionInput.longitude,
      timestamp: new Date(), // On met l'heure actuelle
      vehicule: vehicle, // On lie la position au véhicule trouvé
    });

    return this.positionRepository.save(newPosition);
  }

  // 5. Modifier un véhicule
  async updateVehicle(
    id: number,
    updateVehicleInput: UpdateVehicleInput,
  ): Promise<Vehicule> {
    // On récupère le véhicule (la méthode findOneVehicle gère déjà l'erreur 404 si non trouvé)
    const vehicle = await this.findOneVehicle(id);

    // On fusionne les nouvelles données avec l'ancien véhicule
    Object.assign(vehicle, updateVehicleInput);

    // On sauvegarde
    return this.vehiculeRepository.save(vehicle);
  }

  // 6. Supprimer un véhicule
  async removeVehicle(id: number): Promise<boolean> {
    const vehicle = await this.findOneVehicle(id);
    await this.vehiculeRepository.remove(vehicle);
    return true; // On renvoie true si la suppression a réussi
  }

  // 7. Modifier le Statu d'un véhicule
  async updateStatus(
    updateStatusInput: UpdateVehicleStatusInput,
  ): Promise<Vehicule> {
    const vehicle = await this.findOneVehicle(updateStatusInput.id);
    vehicle.statut = updateStatusInput.statut;
    return this.vehiculeRepository.save(vehicle);
  }
}
