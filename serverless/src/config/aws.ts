export default {
  s3: {
    buckets: {
      image: {
        name: "unirIoImagesBucket",
        region: "sa-east-3",
      },
    },
  },
  rds: {
    databases: {
      mysql: {
        host: "unir-io.x13coqqzhpv4.sa-east-3.rds.amazonaws.com",
        port: "3306",
        db: "unirioAwsSchema",
        user: "unirioAwsDbUser",
        pass: "@DmiN12358",
      },
    },
  },
};
