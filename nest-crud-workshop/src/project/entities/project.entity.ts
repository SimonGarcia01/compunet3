import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Survey } from 'src/survey/entities/survey.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ length: 1 })
    state!: string;

    @Column({ name: 'section_id' })
    sectionId!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @OneToMany(() => Survey, (survey) => survey.project)
    surveys!: Survey[];
}
