# Generated by Django 5.0.11 on 2025-02-25 02:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0009_remove_componentoutput_value_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workflowcomponent',
            name='options',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
