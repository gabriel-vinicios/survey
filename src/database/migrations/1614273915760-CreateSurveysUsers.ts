import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveysUsers1614273915760 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({  
            name: "surveys_users",
            columns:[
                {
                    name: "id",
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'user_id',
                    type: "uuid"
                },
                {
                    name: 'survey_id',
                    type: 'uuid'
                },
                {
                    name: 'value',
                    type: 'number',
                    isNullable: true
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                }
            ],

            foreignKeys:[
                {
                    name: 'fk_user',
                    referencedColumnNames: ['id'],
                    referencedTableName:'users',
                    columnNames: ['user_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                },
                {
                    name: 'fk_surveys',
                    referencedColumnNames: ['id'],
                    referencedTableName:'surveys',
                    columnNames: ['survey_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            ]
            
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("surveys_users")
    }

}
