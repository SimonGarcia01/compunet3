import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Survey } from 'src/survey/entities/survey.entity';

@Entity('home_pages')
export class HomePage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'background_image' })
    backgroundImage!: string;

    @Column({ name: 'welcome_message' })
    welcomeMessage!: string;

    @ManyToOne(() => Survey, (survey) => survey.homePages)
    @JoinColumn({ name: 'survey_id' })
    survey!: Survey;
}
