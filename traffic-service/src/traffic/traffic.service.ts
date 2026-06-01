import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficZone, TrafficLevel } from './entities/traffic-zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateDensityInput } from './dto/update-density.input';

@Injectable()
export class TrafficService {
    constructor(
        @InjectRepository(TrafficZone)
        private trafficZoneRepository: Repository<TrafficZone>,
    ) {}

    // 1. Créer une zone
    async createZone(createZoneInput: CreateZoneInput): Promise<TrafficZone> {
        const existing = await this.trafficZoneRepository.findOne({
            where: { nom: createZoneInput.nom },
        });

        if (existing) {
            throw new ConflictException('Une zone avec ce nom existe déjà');
        }

        const newZone = this.trafficZoneRepository.create(createZoneInput);
        return this.trafficZoneRepository.save(newZone);
    }

    // 2. Consulter toutes les zones
    async findAllZones(): Promise<TrafficZone[]> {
        return this.trafficZoneRepository.find();
    }

    // 3. Consulter une zone par ID
    async findOneZone(id: number): Promise<TrafficZone> {
        const zone = await this.trafficZoneRepository.findOne({ where: { id } });
        if (!zone) {
            throw new NotFoundException(`Zone de trafic avec l'ID ${id} introuvable`);
        }
        return zone;
    }

    // 4. Mettre à jour la densité et calculer le niveau automatiquement
    async updateDensity(updateDensityInput: UpdateDensityInput): Promise<TrafficZone> {
        const zone = await this.findOneZone(updateDensityInput.id);

        // Mise à jour de la densité
        zone.densite = updateDensityInput.densite;

        // Logique métier : Calcul du niveau de trafic
        if (zone.densite < 50) {
            zone.niveau = TrafficLevel.FAIBLE;
        } else if (zone.densite >= 50 && zone.densite < 100) {
            zone.niveau = TrafficLevel.MOYEN;
        } else {
            zone.niveau = TrafficLevel.ELEVE;
        }

        // Sauvegarde en base de données
        return this.trafficZoneRepository.save(zone);
    }

    // 5. Supprimer une zone
    async removeZone(id: number): Promise<boolean> {
        const zone = await this.findOneZone(id);
        await this.trafficZoneRepository.remove(zone);
        return true;
    }

}
