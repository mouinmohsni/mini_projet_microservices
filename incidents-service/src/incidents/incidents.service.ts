import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateIncidentStatusInput } from './dto/update-incident-status.input';
import {UpdateIncidentInput} from "./dto/update-incident.input";

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}

  // 1. cree un incident

  async createIncident(
    createIncidentInput: CreateIncidentInput,
    authorId: number,
  ): Promise<Incident> {
    const newIncident = this.incidentRepository.create({
      ...createIncidentInput,
      authorId: authorId, // ajouter l'id de User connecter
    });
    return this.incidentRepository.save(newIncident);
  }

  //  recuperer  tous les incidents
  async findAllIncidents(): Promise<Incident[]> {
    return this.incidentRepository.find();
  }

  // recupere un incident par id
  async findOneIncident(id: number): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException(`Incident avec l'ID ${id} introuvable`);
    }
    return incident;
  }

  //  Modifier le statut d'un incident
  async updateIncidentStatus(
    updateInput: UpdateIncidentStatusInput,
  ): Promise<Incident> {
    const incident = await this.findOneIncident(updateInput.id);
    incident.statut = updateInput.statut;
    return this.incidentRepository.save(incident);
  }

  // 5. Supprimer un incident
  async removeIncident(id: number): Promise<boolean> {
    const incident = await this.findOneIncident(id);
    await this.incidentRepository.remove(incident);
    return true;
  }

  async update(id: number, updateIncidentInput: UpdateIncidentInput): Promise<Incident> {
    const { id: incidentId, ...updateData } = updateIncidentInput;

    await this.incidentRepository.update(id, updateData);
    return this.findOneIncident(id);
  }
}
