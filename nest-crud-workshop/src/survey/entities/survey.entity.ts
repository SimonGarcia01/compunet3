import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from 'src/project/entities/project.entity';
import { Assignment } from 'src/assignment/entities/assignment.entity';
import { Interview } from 'src/interview/entities/interview.entity';
import { Section } from 'src/section/entities/section.entity';
import { HomePage } from 'src/home-page/entities/home-page.entity';

@Entity('surveys')
export class Survey {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    intro!: string;

    @Column()
    outro!: string;

    @Column()
    validation!: string;

    @Column({ name: 'image_url' })
    imageUrl!: string;

    @Column()
    styles!: string;

    @ManyToOne(() => Project, (project) => project.surveys)
    @JoinColumn({ name: 'project_id' })
    project!: Project;

    @OneToMany(() => Assignment, (assignment) => assignment.survey)
    assignments!: Assignment[];

    @OneToMany(() => Interview, (interview) => interview.survey)
    interviews!: Interview[];

    @OneToMany(() => Section, (section) => section.survey)
    sections!: Section[];

    @OneToMany(() => HomePage, (homePage) => homePage.survey)
    homePages!: HomePage[];
}
