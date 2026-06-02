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

  // Ajouter un véhicule
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

  //  Consulter la liste des véhicules
  async findAllVehicles(): Promise<Vehicule[]> {
    return this.vehiculeRepository.find();
  }

  //  Consulter le détail d'un véhicule (avec son historique de déplacements)
  async findOneVehicle(id: number): Promise<Vehicule> {
    const vehicle = await this.vehiculeRepository.findOne({
      where: { id },
      relations: { positions: true },
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${id} introuvable`);
    }
    return vehicle;
  }

  // Enregistrer une position GPS
  async addPosition(
    createPositionInput: CreatePositionInput,
  ): Promise<VehiclePosition> {
    // On vérifie d'abord que le véhicule existe
    const vehicle = await this.findOneVehicle(createPositionInput.vehicleId);

    const newPosition = this.positionRepository.create({
      latitude: createPositionInput.latitude,
      longitude: createPositionInput.longitude,
      timestamp: new Date(),
      vehicule: vehicle,
    });

    return this.positionRepository.save(newPosition);
  }

  // 5. Modifier un véhicule
  async updateVehicle(
    id: number,
    updateVehicleInput: UpdateVehicleInput,
  ): Promise<Vehicule> {
    const vehicle = await this.findOneVehicle(id);

    Object.assign(vehicle, updateVehicleInput);

    // On sauvegarde
    return this.vehiculeRepository.save(vehicle);
  }

  // 6. Supprimer un véhicule
  async removeVehicle(id: number): Promise<boolean> {
    const vehicle = await this.findOneVehicle(id);
    await this.vehiculeRepository.remove(vehicle);
    return true;
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
