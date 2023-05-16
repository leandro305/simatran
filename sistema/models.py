from djongo import models

class Task(models.Model):
    STATUS = (
        ('doing', 'Fazendo'),
        ('done', 'Feito')
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    done = models.CharField(
        max_length=5,
        choices=STATUS,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    uptated_at = models.DateTimeField(auto_now=True)

class Acidentes_RR(models.Model):
    verbose_name_plural = "Acidentes_RR"
    
    num_acidente = models.IntegerField()
    data_acidente = models.DateField()
    dia_semana = models.TextField(max_length=255)
    fase_dia = models.TextField(max_length=255)
    tp_acidente = models.TextField(max_length=255)
    cond_meteorologica = models.TextField(max_length=255)
    end_acidente = models.TextField(max_length=255)
    num_end_acidente = models.IntegerField()
    cep_acidente = models.IntegerField()
    bairro_acidente = models.TextField(max_length=255)
    km_via_acidente = models.IntegerField()
    latitude_acidente = models.TextField(max_length=255)
    longitude_acidente = models.TextField(max_length=255)
    hora_acidente = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    uptated_at = models.DateTimeField(auto_now=True)
