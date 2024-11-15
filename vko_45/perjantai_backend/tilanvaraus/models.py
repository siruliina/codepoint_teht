from django.db import models

class Varaaja(models.Model):
    id = models.AutoField(primary_key=True)
    nimi = models.CharField(max_length=64)

    def __str__(self):
        return self.nimi


class Tila(models.Model):
    id = models.AutoField(primary_key=True)
    nimi = models.CharField(max_length=64)

    def __str__(self):
        return self.nimi


class Varaus(models.Model):
    id = models.AutoField(primary_key=True)
    varauspaiva = models.DateTimeField()
    varaaja = models.ForeignKey(Varaaja, on_delete=models.CASCADE)
    tila = models.ForeignKey(Tila, on_delete=models.CASCADE)

    def __str__(self):
        return f"Varaus {self.id} - {self.varauspaiva} - {self.varaaja.nimi} - {self.tila.nimi}"

class Kayttaja(models.Model):

    ADMIN = 'admin'
    USER = 'user'
    
    ROOLI_CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
    ]

    tunnus = models.AutoField(primary_key=True)
    nimi = models.CharField(max_length=64)
    salasana = models.CharField(max_length=64)
    rooli = models.CharField(
        max_length=5,
        choices=ROOLI_CHOICES,
        default=USER
    )

    def __str__(self):
        return self.nimi
